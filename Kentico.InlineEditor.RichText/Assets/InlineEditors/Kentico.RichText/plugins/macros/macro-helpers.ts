import { ContextMacros } from "./macro-types";

export const getMacroDisplayName = (macros: ContextMacros, macroValue: string) => macros[macroValue] || `param: ${macroValue}`;