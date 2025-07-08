import axios from 'axios';
import { loadRenderConfig, updateServiceConfig, ServiceFromYaml } from './render.config';

const renderApiUrl = 'https://api.render.com/v1/services';
const renderToken = process.env.RENDER_TOKEN


interface DeployResponse {
  success: boolean;
  message: string;
}

// Deploy function
export default async function deployToRender(
  branchName: string,
  owner: string,
  repo: string
): Promise<DeployResponse> {
  try {
    // 1. Load Render configuration
    const renderConfig = await loadRenderConfig("./render.yaml");

    // 2. Validate service configuration existence
    if (!renderConfig?.services?.[0]) {
      throw new Error("No service configuration found in render.yaml");
    }

    const serviceFromYaml: ServiceFromYaml = renderConfig.services[0];
    // 5. Update service config
    const updatedServiceConfigResult = await updateServiceConfig({
      serviceFromYaml,
      owner,
      repo,
      branchName
    });

    // 6. Send deployment request
    const response = await axios({
      method: "POST",
      url: renderApiUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${renderToken || ""}`,
      },
      data: updatedServiceConfigResult.serviceFromYaml,
    });

    // 7. Handle successful deployment
    if (response.status === 201) {
      console.log(
        `Service '${updatedServiceConfigResult.serviceFromYaml.name}' deployed successfully from branch '${branchName}'!`
      );
      return {
        success: true,
        message: `Service deployed from branch ${branchName}.`,
      };
    } else {
      console.error(
        `Failed to deploy from branch '${branchName}':`,
        response.status,
        response.statusText
      );
      console.error("Response Data:", response.data);
      return {
        success: false,
        message: `Deployment failed: ${response.status} - ${response.statusText} - ${JSON.stringify(response.data)}`,
      };
    }
  } catch (error) {
    console.error("Error deploying:", error);
    return {
      success: false,
      message: `Deployment error: ${(error as Error).message}`,
    };
  }
}
