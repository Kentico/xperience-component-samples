import { getStringForPlugin } from "../plugin-helpers";
import { PluginType, DialogMode } from "../plugin-types";
import { PathSelectorMetadata } from "./link-types";

export const getString = (resourceKey: string) => getStringForPlugin(resourceKey, PluginType.LinkPlugin);

const EMPTY_PAGE_DATA = { name: "", nodeGuid: "" };

/**
 * Gets page name and node GUID for specific URL path from server when DialogMode=UPDATE
 * @param endpointUrl Server endpoint for retrieving data.
 * @param path URL path.
 * @param dialogMode Dialog mode.
 */
export const getPathSelectorMetadata = async (endpointUrl: string, path: string, dialogMode: DialogMode): Promise<PathSelectorMetadata> => {

  if (dialogMode === DialogMode.INSERT) {
    return EMPTY_PAGE_DATA;
  }

  const queryParameter = `pageUrl=${encodeURIComponent(path)}`;
  const queryDelimiter = endpointUrl.includes("?") ? "&" : "?";
  const url = endpointUrl.concat(queryDelimiter, queryParameter);
  const json = await getData(url);

  return {
    name: json.name,
    nodeGuid: json.nodeGuid,
  };
}

const getData = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  }
  catch (error) {
    console.error(error);
  }

  return EMPTY_PAGE_DATA;
}
