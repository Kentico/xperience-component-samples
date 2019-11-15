import { getStringForPlugin } from "../plugin-helpers";
import { PluginType } from "../plugin-types";
import { LinkInfo, LinkType } from "./link-types";

export const getString = (resourceKey: string) => getStringForPlugin(resourceKey, PluginType.LinkPlugin);

/**
 * Gets info for specific URL from server.
 * @param endpointUrl Server endpoint for retrieving link info.
 * @param linkUrl Link URL.
 */
export const getLinkInfo = async (endpointUrl: string, linkUrl: string): Promise<LinkInfo> => {
  const queryParameter = `linkUrl=${encodeURIComponent(linkUrl)}`;
  const queryDelimiter = endpointUrl.includes("?") ? "&" : "?";
  const url = endpointUrl.concat(queryDelimiter, queryParameter);
  
  return getData(url);
}

const getData = async (url: string): Promise<LinkInfo> => {
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

  return { 
    linkType: LinkType.EXTERNAL,
    linkMetadata: {
      name: "",
      identifier: "",
    },
  };
}
