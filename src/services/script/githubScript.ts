
// import deployToRender from "../../services/deployToRender";
import { Octokit } from "@octokit/rest";
import crypto from "crypto";
import { retry } from "@octokit/plugin-retry";
import deployToRender from "./deployToRender";

interface Branch {
  name: string;
}

interface UpdateBranchesResponse {
  success: boolean;
  updatedBranches?: number;
  error?: string;
}
interface Branch {
  name: string;
}
 const token: string = process.env.GITHUB_TOKEN!;
  const MyOctokit = Octokit.plugin(retry);

const rateLimitedOctokit = new MyOctokit({
  auth: token, // Replace with your actual GitHub token
  request: {
    retries: 3, // Retry failed requests up to 3 times
    retryDelay: (retryCount: number) => {
      return retryCount * 1000; // Exponential backoff (1s, 2s, 4s)
    },
  },
});
export async function createNewBranch(
  owner: string,
  repo: string,
  existingBranchName: string,
  branchName: string,
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`Creating branch with name: ${branchName}`);
    // Check if the branch already exists
    const { data: branches } = await rateLimitedOctokit.rest.repos.listBranches({
      owner,
      repo,
    });
    const existingBranch = branches.find(
      (branch: Branch) => branch.name === branchName
    );

    if (existingBranch !== undefined) {
      return {
        success: false,
        message: `Branch '${branchName}' already exists.`,
      };
    }

    // Get the SHA of the existing branch (defaults to 'main')
    const { data: refData } = await rateLimitedOctokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${existingBranchName}`,
    });

    const sha = refData.object.sha;

    // Create the new branch
    await rateLimitedOctokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha,
    });

    // Deploy to Render (using Render API) - Handle potential errors
    try {
      const deployResult = await deployToRender(branchName, owner, repo);
      if (deployResult.success) {
        console.log(`Branch '${branchName}' deployed to Render successfully.`);
        return {
          success: true,
          message: `Branch '${branchName}' created and deployed to Render successfully.`,
        };
      } else {
        return {
          success: false,
          message: `Branch created, but deployment to Render failed: ${deployResult.message}`,
        };
      }
    } catch (deployError:any) {
      console.error("Error deploying to Render:", deployError.message);
      return {
        success: false,
        message: `Branch created, but deployment to Render failed: ${deployError.message}`,
      };
    }
  } catch (error) {
    // Re-throw the error to be handled by the calling route
    throw error;
  }
}
export async function deleteBranch(
  owner: string,
  repo: string,
  branchName: string,
): Promise<{ success: boolean, message: string }> {
  try {
    console.log(`Deleting branch: ${branchName}`);

    // Delete the branch
    await rateLimitedOctokit.rest.git.deleteRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });

    console.log(`Branch '${branchName}' deleted successfully!`);
    return { success: true, message: `Branch '${branchName}' deleted successfully!` };
  } catch (error: any) {
    if (error.status === 404) {
      console.error(`Branch '${branchName}' not found.`);
      return { success: false, message: `Branch '${branchName}' not found.` };
    } else if (error.status === 409) {
      console.error("Branch deletion failed. The branch might be protected.");
      return { success: false, message: "Branch deletion failed. The branch might be protected." };
    } else {
      console.error("Error deleting branch:", error.message);
      return { success: false, message: `Error deleting branch: ${error.message}` };
    }
  }
}
export async function getAllBranches(
  owner: string,
  repo: string,
): Promise<Branch[]> {
  let allBranches: Branch[] = [];
  let page: number | null = 1;
  const per_page = 100; // Adjust per_page as needed (maximum 100 per page)

  while (true) {
    try {
      console.log(`Fetching page ${page} of branches...`);
      const { data: branches, headers } = await rateLimitedOctokit.rest.repos.listBranches({
        owner,
        repo,
        per_page,
        page,
      });

      allBranches = allBranches.concat(branches);

      // Check if there are more pages
      const linkHeader = headers.link;
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        console.log("No more pages of branches found.");
        break;
      }

      // Extract next page URL from Link header
      const match = linkHeader.match(/<(.+)>; rel="next"/);
      if (!match) throw new Error("Next page URL not found");
      const nextPageUrl = match[1];

      const nextPageParams: URLSearchParams = new URL(nextPageUrl).searchParams;
      const pageParam = nextPageParams.get("page");
      if (pageParam !== null) {
        page = parseInt(pageParam);
      } else {
        // Handle the case where "page" parameter is missing
        console.error("Missing 'page' parameter in next page URL");
        // You can also throw an error or return from the function here
      }
      console.log(`Fetching next page: ${page}`);
    } catch (error:any) {
      console.error(`Error fetching branches: ${error.message}`);
      // Handle API errors (e.g., rate limits, network issues)
      if (
        error.status === 403 &&
        error.headers["x-ratelimit-remaining"] === "0"
      ) {
        const resetTime = parseInt(error.headers["x-ratelimit-reset"]);
        const now = Math.floor(Date.now() / 1000);
        const delay = (resetTime - now) * 1000 + 1000; // Add 1 second buffer
        console.warn(
          `Rate limit exceeded. Waiting for ${delay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Handle other types of errors (e.g., network errors)
        throw error;
      }
    }
  }

  console.log(`Fetched a total of ${allBranches.length} branches.`);
  return allBranches;
}
export async function updateAllBranches(
  owner: string,
  repo: string,
  baseBranch: string = "master",
): Promise<UpdateBranchesResponse> {
  try {
    const allBranches: Branch[] = await getAllBranches(owner, repo);
    const totalBranches = allBranches.length;
    let updatedBranches = 0;

    // Divide branches into batches (e.g., 30 branches per batch)
    const batchSize = 30;
    const batches: Branch[][] = [];
    for (let i = 0; i < allBranches.length; i += batchSize) {
      batches.push(allBranches.slice(i, i + batchSize));
    }

    // Process batches with a delay between each batch
    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1} of ${batches.length}...`);
      await Promise.all(
        batches[i].map(async (branch: Branch) => {
          if (branch.name === baseBranch) {
            console.log(`Skipping base branch '${branch.name}'.`);
            return;
          }

          try {
            await updateBranch(owner, repo, branch.name, baseBranch);
            console.log(`Updated branch '${branch.name}' successfully.`);
            updatedBranches++;
          } catch (error:any) {
            if (
              error.status === 404 &&
              error.message.includes("Branch not found")
            ) {
              console.warn(`Branch '${branch.name}' not found. Skipping.`);
            } else {
              console.error(`Error updating branch '${branch.name}':`, error);
            }
          }
        })
      );

      // Introduce a delay between batches (e.g., 1 minute)
      console.log(`Waiting for 1 minute before processing the next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    console.log(
      `Updated ${updatedBranches} out of ${
        totalBranches - 1
      } branches successfully.`
    );
    return { success: true, updatedBranches };
  } catch (error:any) {
    console.error("Error updating branches:", error);
    return { success: false, error: error.message };
  }
}
export async function updateBranch(
  owner: string,
  repo: string,
  branchName: string,
  baseBranch: string,
): Promise<void> {
  try {
    // Get the latest commit SHA of the base branch
    const { data: baseBranchRef } = await rateLimitedOctokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });
    const baseBranchSHA = baseBranchRef.object.sha;

    // Update the branch reference to point to the latest commit SHA
    await rateLimitedOctokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: baseBranchSHA,
      force: false, // Set to true for forced updates (use with caution)
    });

    console.log(`Branch '${branchName}' updated successfully.`);
  } catch (error:any) {
    if (error.status === 401) {
      console.error(
        "Authentication failed. Please check your GitHub credentials or consider using a GitHub App for enhanced security."
      );
    } else if (error.status === 404) {
      console.error(`Branch '${branchName}' not found.`);
    } else if (error.status === 422) {
      console.error("Error updating branch:", error.message); // Handle 422 errors (e.g., invalid SHA)
    } else {
      console.error("Error updating branch:", error);
    }
  }
}
// Handle webhook events
export async function handleWebhook(
  payload: any,
): Promise<void> {
  try {
    // 1. Basic Payload Validation
    if (
      !payload ||
      !payload.ref ||
      !payload.repository ||
      !payload.repository.owner ||
      !payload.repository.name
    ) {
      throw new Error("Invalid or missing data in webhook payload");
    }

    // 2. Signature Verification
    const signature = payload.headers["x-hub-signature"];
    const hmac = crypto.createHmac("sha1", process.env.RENDER_TOKEN!);
    hmac.update(JSON.stringify(payload));
    const calculatedSig = `sha1=${hmac.digest("hex")}`;

    if (signature !== calculatedSig) {
      throw new Error("Unauthorized");
    }

    // 3. Event Handling
    // Determine event type based on ref and commits
    let eventType = "pushed"; // Default to push event

    if (
      payload.commits &&
      payload.commits.length > 0 &&
      payload.commits[0].created
    ) {
      eventType = "created"; // New branch created
    } else if (
      payload.commits &&
      payload.commits.length > 0 &&
      payload.commits[0].deleted
    ) {
      eventType = "deleted"; // Branch deleted
    }

    switch (eventType) {
      case "pushed":
        if (payload.ref === `refs/heads/master`) {
          await updateAllBranches(
            payload.repository.owner.login,
            payload.repository.name,
            undefined,
          );
          // await getAllBranches(payload.repository.owner.login, payload.repository.name)
        }
        break;
      case "created":
        console.log("Webhook event: branch created");
        // Handle branch creation logic here
        break;
      case "deleted":
        console.log("Webhook event: branch deleted");
        // Handle branch deletion logic here
        break;
      default:
        console.log(`Ignoring unknown webhook event: ${eventType}`);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    throw error;
  }
}