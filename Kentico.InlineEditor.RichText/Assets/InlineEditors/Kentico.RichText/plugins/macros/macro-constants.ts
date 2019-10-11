export const MACROS_PLUGIN_NAME = "kenticoMacroPlugin";

export const INSERT_MACRO_COMMAND_NAME = "insertMacro";
export const REMOVE_MACRO_COMMAND_NAME = "removeMacro";
export const UPDATE_URL_MACRO_COMMAND_NAME = "updateUrlParameterMacro";
export const UPDATE_CONTEXT_MACRO_COMMAND_NAME = "updateContextMacro";
export const CONFIGURE_MACRO_COMMAND_NAME = "configureMacro";
export const OPEN_INSERT_MACRO_POPUP_COMMAND_NAME = "openInsertMacroPopup";
export const CLOSE_CONFIGURE_POPUP_COMMAND_NAME = "popupConfigureClose";
export const SWITCH_MACRO_TAB_COMMAND_NAME = "openMacroTab";
export const SWITCH_URL_TAB_COMMAND_NAME = "openQueryTab";

export const INSERT_URL_MACRO_COMMAND_NAME = "insertUrlMacro";
export const INSERT_CONTEXT_MACRO_COMMAND_NAME = "insertContextMacro";

export const MACRO_CLASS = "ktc-macro";
export const MACRO_ACTIVE_CLASS = `${MACRO_CLASS}-active`;


// Pop-ups

export const ACTIONS_POPUP_NAME = `${MACROS_PLUGIN_NAME}.popup`;

export const CONFIGURATION_POPUP_NAME = `${MACROS_PLUGIN_NAME}.popupConfigure`;
export const CONFIGURE_URL_MACRO_POPUP_NAME = `${MACROS_PLUGIN_NAME}.popupUrl`;
export const CONFIGURE_CONTEXT_MACRO_POPUP_NAME = `${MACROS_PLUGIN_NAME}.popupContext`;

// Icons

export const ICON_MACRO = "m 1,12 3,-5 3,5 z m 22,0 -3,5 -3,-5 z M 8.34277,8.21484 h 7.82663 l 0.0127,2.62156 H 15.8076 C 15.6849,9.9012 15.3337,9.26855 14.7539,8.93848 14.4281,8.75651 13.9414,8.65706 13.2939,8.64014 v 6.84276 c 0,0.4782 0.0826,0.7956 0.2476,0.9522 0.1693,0.1565 0.5184,0.2348 1.0474,0.2348 V 17 H 9.95508 v -0.3301 c 0.50782,0 0.84422,-0.0783 1.00932,-0.2348 0.1692,-0.1608 0.2539,-0.4782 0.2539,-0.9522 V 8.64014 C 10.5835,8.65706 10.0968,8.75651 9.7583,8.93848 9.13623,9.27702 8.78499,9.90967 8.70459,10.8364 H 8.33008 Z M 12,19 c 2.3972,0 4.513,-1.205 5.7746,-3.0423 l 1.1063,1.8438 C 17.23,19.7576 14.7601,21 12,21 7.02944,21 3,16.9706 3,12 3,11.662 3.01863,11.3283 3.05493,11 H 5.07089 C 5.02417,11.3266 5,11.6605 5,12 c 0,3.866 3.13401,7 7,7 z M 6.2254,8.04233 C 7.48704,6.205 9.6028,5 12,5 c 3.866,0 7,3.13401 7,7 0,0.3395 0.0467,-0.3266 0,0 h 2 c 0.0363,-0.3283 0,0.338 0,0 C 21,7.02944 16.9706,3 12,3 9.23993,3 6.77005,4.24243 5.11912,6.19853 Z";
export const ICON_URL_PARAM = "M16.456941 4.788366C14.346076 4.788366 12.619002 6.6581714 12.619002 8.943489C12.619002 8.943489 14.537971 8.943489 14.537971 8.943489C14.537971 7.8008302 15.401507 6.8659275 16.456941 6.8659275C17.512374 6.8659275 18.375911 7.8008302 18.375911 8.943489C18.375911 11.021051 15.497455 10.709418 15.497455 14.137394C15.497455 14.137394 15.497455 15.176174 15.497455 15.176174C15.497455 15.176174 17.416426 15.176174 17.416426 15.176174C17.416426 15.176174 17.416426 14.137394 17.416426 14.137394C17.416426 11.852075 20.294881 11.540442 20.294881 8.943489C20.294881 6.6581714 18.567807 4.788366 16.456941 4.788366C16.456941 4.788366 16.456941 4.788366 16.456941 4.788366M15.497455 17.253737C15.497455 17.253737 17.416426 17.253737 17.416426 17.253737C17.416426 17.253737 17.416426 19.331299 17.416426 19.331299C17.416426 19.331299 15.497455 19.331299 15.497455 19.331299C15.497455 19.331299 15.497455 17.253737 15.497455 17.253737M10.170443 4.7001474C10.170443 4.7001474 3.8418003 19.29756 3.8418003 19.29756C3.8418003 19.29756 5.8253586 19.28441 5.8253586 19.28441C5.8253586 19.28441 12.164521 4.7137829 12.164521 4.7137829";
export const ICON_CONTACT_ATTRIBUTES = "M 16,16 H 22 V 18 H 16 Z M 14,6 H 22 V 8 H 14 Z M 14,11 H 22 V 13 H 14 Z M 8,5.0572534 C 6.3794438,5.0572534 5.0572534,6.3794438 5.0572534,8 5.057254,9.6205557 6.3794443,10.942747 8,10.942747 9.6205553,10.942746 10.942746,9.6205553 10.942747,8 10.942747,6.3794443 9.6205557,5.057254 8,5.0572534 Z M 14,19 H 2 C 2,19 1.99997,12 7.99997,12 14,12 14,19 14,19 Z";