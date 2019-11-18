import { getStringForPlugin } from "../plugin-helpers";
import { PluginType } from "../plugin-types";
import { LinkType } from "./link-types";
import { LinkModel } from "./link-model";

export const getString = (resourceKey: string) => getStringForPlugin(resourceKey, PluginType.LinkPlugin);

/**
 * Gets info for specific URL from server.
 * @param endpointUrl Server endpoint for retrieving link info.
 * @param linkUrl Link URL.
 */
export const getLinkModel = async (endpointUrl: string, linkUrl: string): Promise<LinkModel> => {
  const queryParameter = `linkUrl=${encodeURIComponent(linkUrl)}`;
  const queryDelimiter = endpointUrl.includes("?") ? "&" : "?";
  const url = endpointUrl.concat(queryDelimiter, queryParameter);
  
  return getData(url);
}

const getData = async (url: string): Promise<LinkModel> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }
  catch (error) {
    console.error(error);
  }

  return new LinkModel(LinkType.EXTERNAL);
}
