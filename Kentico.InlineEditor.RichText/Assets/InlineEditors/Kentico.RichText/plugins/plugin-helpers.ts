import { PluginType } from "./plugin-types";

export const getStringForPlugin = (resourceKey: string, pluginType: PluginType) => {
  let namespace;

  switch (pluginType) {
    case PluginType.MacroPlugin:
      namespace = "Kentico.InlineEditor.RichText.MacroPlugin";
      break;
    case PluginType.LinkPlugin:
      namespace = "Kentico.InlineEditor.RichText.LinkPlugin";
      break;
    default:
      namespace = "";
      break;
  }

  return window.kentico.localization.strings[`${namespace}.${resourceKey}`] || `${namespace}.${resourceKey}`;
}
