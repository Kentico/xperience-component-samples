import { ContextMacros } from "./macro-types";
import { getStringForPlugin } from "../plugin-helpers";
import { PluginType } from "../plugin-types";

export const getMacroDisplayName = (macros: ContextMacros, macroValue: string) =>
    (macros && macros[macroValue]) || `${getString("MacroElement.UrlParameterPrefix")}: ${macroValue}`;

export const getString = (resourceKey: string) => getStringForPlugin(resourceKey, PluginType.MacroPlugin);
