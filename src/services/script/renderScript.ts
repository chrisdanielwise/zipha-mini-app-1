import axios from "axios";

const DEPLOY_HOOK_URL = process.env.RENDER_DEPLOY_HOOK;
const RENDER_API_URL = "https://api.render.com/v1/services";
const RENDER_TOKEN = process.env.RENDER_TOKEN;

// 🔹 Get Service ID by Name
export async function getServiceId(serviceName: string) {
    try {
      const response = await axios({
        method: "GET",
        url: RENDER_API_URL,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${RENDER_TOKEN || ""}`,
        },
      });
  
      console.log("✅ All services response:");
  
      if (!Array.isArray(response.data)) {
        console.error("❌ Unexpected response format:", response.data);
        return null;
      }
  
      // ✅ Find service by name inside the `service` object
      const service = response.data.find(
        (s: any) => s.service?.name?.toLowerCase() === serviceName.toLowerCase()
      );
  
      if (!service) {
        console.error(`❌ Service '${serviceName}' not found. Available services:`, 
          response.data.map((s: any) => s.service?.name));
        return null;
      }
  
      // ✅ Extract service ID correctly from `service` object
      const serviceId = service.service?.id;
  
      if (!serviceId) {
        console.error(`❌ Service ID not found for '${serviceName}'. Full service data:`, service);
        return null;
      }
  
      console.log(`✅ Found Service ID for '${serviceName}':`, serviceId);
      return serviceId;
    } catch (error: any) {
      console.error("❌ Error fetching services:", error.response?.data || error.message);
      return null;
    }
  }
  
// 🔹 Trigger Deploy Hook
export async function triggerDeploy() {
    if (!DEPLOY_HOOK_URL) {
        return { success: false, message: "No deploy hook URL found" };
    }

    try {
        // const response = await axios.post(DEPLOY_HOOK_URL);
        const response = await axios({
            method: "POST",
            url:DEPLOY_HOOK_URL,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
          })

        console.log("🚀 Deployment Triggered Successfully:", response.data);
        return { success: true, message: "Deployment triggered successfully", data: response.data };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("❌ Axios Error triggering deployment:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }

        console.error("❌ Unexpected Error triggering deployment:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}

export const deleteService = async (serviceName: string) => {
    try {
      const serviceId = await getServiceId(serviceName);
      if (!serviceId) {
        console.error("❌ Service not found:", serviceName);
        return;
      }
  
      const response = await axios({
        method: "DELETE",
        url: `${RENDER_API_URL}/${serviceId}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${RENDER_TOKEN || ""}`,
        },
      });
  
      console.log("✅ Service Deleted:", response.data);
      return response.data;
    } catch (error:any) {
      console.error("❌ Error deleting service:", error.response?.data || error.message);
    }
  };

// 🚀 Create Service
export const createService = async () => {
    try {
        const response = await axios({
            method: "POST",
            url: RENDER_API_URL,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
            data: {
                type: "web_service",
                autoDeploy: "yes",
                serviceDetails: {
                    pullRequestPreviewsEnabled: "no",
                    previews: { generation: "off" },
                    runtime: "node",
                    envSpecificDetails: { buildCommand: "npm install", startCommand: "npm start" },
                },
                name: process.env.SERVICE_NAME,
                ownerId: process.env.RENDER_OWNER_ID,
                repo: process.env.GITHUB_REPO,
                branch: "main",
            },
        });

        console.log("✅ Service Created:", response.data);
        return response.data;
    } catch (error:any) {
        console.error("❌ Error creating service:", error.response?.data || error.message);
    }
};

// 🚀 List All Services
export const listServices = async () => {
    try {
        const response = await axios({
            method: "GET",
            url: RENDER_API_URL,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
        });
        console.log("✅ Services List:", response.data);
        return response.data;
    } catch (error:any) {
        console.error("❌ Error listing services:", error.response?.data || error.message);
    }
};

// 🚀 Update Service
export const updateService = async (serviceName: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        const response = await axios({
            method: "PATCH",
            url: `${RENDER_API_URL}/${serviceId}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
            data: {
                autoDeploy: "no",
                serviceDetails: {
                    pullRequestPreviewsEnabled: "no",
                    previews: { generation: "off" },
                    runtime: "node",
                    envSpecificDetails: { buildCommand: "npm install", startCommand: "npm start" },
                },
            },
        });

        console.log("✅ Service Updated:", response.data);
        await triggerDeploy();

        return response.data;
    } catch (error:any) {
        console.error("❌ Error updating service:", error.response?.data || error.message);
    }
};
export const updateEnvVars = async (serviceName: string, envVars: { key: string; value: string }[]) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;
        const requestBody = [
              { key: "RENDER_TOKEN", value: process.env.RENDER_TOKEN || "" },
              { key: "GITHUB_TOKEN", value: process.env.GITHUB_TOKEN || "" },
              { key: "RENDER_OWNER_TOKEN", value: process.env.RENDER_OWNER_TOKEN || "" },
              { key: "WEBHOOK_SECRET", value: process.env.WEBHOOK_SECRET || "" },
              { key: "TELEGRAM_API_ID", value: process.env.TELEGRAM_API_ID || "" },
              { key: "TELEGRAM_API_HASH", value: process.env.TELEGRAM_API_HASH || "" },
              { key: "TELEGRAM_SESSION", value: process.env.TELEGRAM_SESSION || "" }
            ]
;
          
        //   console.log(JSON.stringify(requestBody, null, 2)); // Convert to valid JSON
          
        const response = await axios({
            method: "PUT", // Use PATCH for updating multiple env vars
            url: `${RENDER_API_URL}/${serviceId}/env-vars`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
            data:  requestBody , // ✅ Convert to JSON string, // Pass the array of env variables
        });

        console.log("✅ Updated Env Vars:", response.data,envVars);
        return response.data;
    } catch (error: any) {
        console.error("❌ Error updating env vars:", error.response?.data || error.message);
    }
};

// 🚀 Add or Update Environment Variable
export const addEnvVar = async (serviceName: string, key: string, value: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        const response = await axios({
            method: "PUT",
            url: `${RENDER_API_URL}/${serviceId}/env-vars/${key}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
            data: { value },
        });

        console.log("✅ Env Var Updated:", response.data);
        await triggerDeploy();

        return response.data;
    } catch (error:any) {
        console.error("❌ Error updating env var:", error.response?.data || error.message);
    }
};

// 🚀 List Environment Variables
export const listEnvVars = async (serviceName: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        const response = await axios({
            method: "GET",
            url: `${RENDER_API_URL}/${serviceId}/env-vars`,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
        });

        console.log("✅ Env Vars:", response.data);
        return response.data;
    } catch (error:any) {
        console.error("❌ Error listing env vars:", error.response?.data || error.message);
    }
};

// 🚀 Delete Environment Variable
export const deleteEnvVar = async (serviceName: string, key: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        await axios({
            method: "DELETE",
            url: `${RENDER_API_URL}/${serviceId}/env-vars/${key}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
        });

        console.log(`✅ Env Var '${key}' deleted.`);
        await triggerDeploy();
    } catch (error:any) {
        console.error("❌ Error deleting env var:", error.response?.data || error.message);
    }
};

// 🚀 Restart Service
export const restartService = async (serviceName: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        const response = await axios({
            method: "POST",
            url: `${RENDER_API_URL}/${serviceId}/restart`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
        });

        console.log("✅ Service Restarted:", response.data);
        return response.data;
    } catch (error:any) {
        console.error("❌ Error restarting service:", error.response?.data || error.message);
    }
};
export const suspendService = async (serviceName: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        const response = await axios({
            method: "POST",
            url: `${RENDER_API_URL}/${serviceId}/suspend`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
        });

        console.log("✅ Service Suspended:", response.data);
        return response.data;
    } catch (error:any) {
        console.error("❌ Error suspending service:", error.response?.data || error.message);
    }
};

// 🚀 Resume Service
export const resumeService = async (serviceName: string) => {
    try {
        const serviceId = await getServiceId(serviceName);
        if (!serviceId) return;

        const response = await axios({
            method: "POST",
            url: `${RENDER_API_URL}/${serviceId}/resume`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${RENDER_TOKEN || ""}`,
            },
        });

        console.log("✅ Service Resumed:", response.data);
        return response.data;
    } catch (error:any) {
        console.error("❌ Error resuming service:", error.response?.data || error.message);
    }
};