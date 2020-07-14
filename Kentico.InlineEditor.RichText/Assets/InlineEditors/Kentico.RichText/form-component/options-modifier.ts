import {FroalaOptionsModifier} from "../types";

export const formComponentOptionsModifier: FroalaOptionsModifier = (options) => {
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
