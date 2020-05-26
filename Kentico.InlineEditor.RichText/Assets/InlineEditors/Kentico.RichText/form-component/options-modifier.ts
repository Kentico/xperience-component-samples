import {FroalaOptionsModifier} from "../types";

export const iframeStyle = ".ktc-macro { cursor: pointer; border: 1px solid black; border-radius: 3px; padding: 0 4px; background-color: #e5e5e5;} .ktc-macro:hover { -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.75); box-shadow: 0 0 3px rgba(0, 0, 0, 0.75);}";

export const formComponentOptionsModifier: FroalaOptionsModifier = (options) => {
    if (options) {
        addIframeStyles(options);
    }
    if (options?.toolbarButtons) {
        removeFullScreenMode(options);
    }
};

const removeFullScreenMode: FroalaOptionsModifier = (options) => {
    if (Array.isArray(options.toolbarButtons)) {
        options.toolbarButtons = options.toolbarButtons.filter(i => i !== 'fullscreen');
    } else if (typeof options.toolbarButtons === 'object') {
        for (const value of Object.values(options.toolbarButtons)) {
            if (value && value.buttons) {
                value.buttons = value?.buttons.filter(i => i !== 'fullscreen');
            }
        }
    }
};

const addIframeStyles: FroalaOptionsModifier = (options) => {
    options.iframeStyle = iframeStyle;
};