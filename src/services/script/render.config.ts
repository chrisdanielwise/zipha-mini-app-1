// import * as fs from 'fs';
import * as jsYaml from "js-yaml";
import axios from 'axios';
import { promises as fs } from 'fs';


const renderToken = process.env.RENDER_TOKEN;
interface RenderConfig {
  [key: string]: any;
}
export interface ServiceDetails {
  pullRequestPreviewsEnabled: string;
  previews: {
    generation: string;
  };
  plan: string;
  envSpecificDetails: {
    buildCommand: string;
    startCommand: string;
  };
  runtime: string;
  envVars: { 
    key: string; 
    value?: string; 
    generateValue?: boolean; 
  }[];

}
export interface ServiceFromYaml {
  [key: string]: string | number | boolean | object;
  serviceDetails: ServiceDetails;
}
export  interface ServiceConfig {
  serviceFromYaml: ServiceFromYaml;
}
export async function loadRenderConfig(filePath: string): Promise<RenderConfig> {
  try {
    const yamlData = await fs.readFile(filePath, 'utf8');
    const config = jsYaml.load(yamlData) as RenderConfig; // Explicitly cast to RenderConfig
    return config;
  } catch (error) {
    console.error('Error loading or parsing render.yaml:', error);
    throw new Error('Failed to load render.yaml. Ensure the file exists and is correctly formatted.');
  }
}
export async function getRenderOwnerId(): Promise<string> {
  try {
    const response = await axios.get('https://api.render.com/v1/owners', {
      headers: {
        Authorization: `Bearer ${renderToken}`,
      },
    });
    console.log(response.data[0].owner.id, 'ownerId');
    return response.data[0].owner.id;
  } catch (error:any) {
    console.error(
      'Error getting Render owner ID:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
export async function updateServiceConfig({
  serviceFromYaml,
  owner,
  repo,
  branchName
}:{
  serviceFromYaml: ServiceFromYaml,
  owner: string;
  repo: string;
  branchName:string
}): Promise<ServiceConfig> {
  try {
    if (!serviceFromYaml  || typeof serviceFromYaml !== "object") {
      throw new Error("Invalid serviceConfig: serviceConfig must be an object");
    }

    // Await owner ID retrieval
    const ownerId: string = await getRenderOwnerId();

    // Updated service configuration
    const updatedService: ServiceConfig = {
      serviceFromYaml:{
        ...serviceFromYaml, 
        ownerId,
        repo: `https://github.com/${owner}/${repo}.git` ,
        branch:branchName,
        name:`${branchName}_zipha_bot`,
        envVars: [
          { key: "RENDER_TOKEN", value: process.env.RENDER_TOKEN },
          { key: "GITHUB_TOKEN", value: process.env.GITHUB_TOKEN },
          { key: "RENDER_OWNER_TOKEN", value: process.env.RENDER_OWNER_TOKEN },
          { key: "WEBHOOK_SECRET", value: process.env.WEBHOOK_SECRET },
          { key: "TELEGRAM_API_ID", value: process.env.TELEGRAM_API_ID },
          { key: "TELEGRAM_API_HASH", value: process.env.TELEGRAM_API_HASH },
          { key: "TELEGRAM_SESSION", value: process.env.TELEGRAM_SESSION }
        ],
      }}

    return updatedService;
  } catch (error) {
    console.error("Error updating service config:", error);
    throw error;
  }
}
