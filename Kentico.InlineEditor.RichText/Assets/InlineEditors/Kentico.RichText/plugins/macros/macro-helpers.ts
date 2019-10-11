import { ContextMacros } from "./macro-types";

export const getMacroDisplayName = (macros: ContextMacros, macroValue: string) => (macros && macros[macroValue]) || `${getString("MacroElement.UrlParameterPrefix")}: ${macroValue}`;

export const getString = (resourceKey: string) => window.kentico.localization.strings[`Kentico.InlineEditor.RichText.MacroPlugin.${resourceKey}`];