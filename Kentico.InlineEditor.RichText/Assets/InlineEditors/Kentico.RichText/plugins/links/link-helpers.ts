import { getStringForPlugin } from "../plugin-helpers";
import { PluginType } from "../plugin-types";

export const getString = (resourceKey: string) => getStringForPlugin(resourceKey, PluginType.LinkPlugin);
