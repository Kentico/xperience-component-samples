import FroalaEditor, { FroalaOptions, FroalaEvents } from "froala-editor/js/froala_editor.pkgd.min";

import { replaceMacrosWithElements, bindMacroClickListener } from "./plugins/macros/macro-services";
import { FroalaEventsOption } from "./types";

export const getEvents = (editorValue: string, instanceSpecificOptions: Partial<FroalaOptions>, customOptions: Partial<FroalaOptions>): Partial<FroalaEvents> => {
    const events: Partial<FroalaEvents> = {
        initialized() {
            if (editorValue) {
                const editModePropertyValue = replaceMacrosWithElements(editorValue, this.opts.contextMacros);
                this.html.set(editModePropertyValue);
            }
        },
        ["html.set"]() {
            bindMacroClickListener(this);
        },
        contentChanged() {
            bindMacroClickListener(this);
        },
    };

    const defaultWithInstanceEvents = mergeWithCustomEvents(events, instanceSpecificOptions);
    return mergeWithCustomEvents(defaultWithInstanceEvents, customOptions);
}

/**
 * Marges the default Froala event implementations for RTE with custom ones.
 * @param defaultEvents Default Froala event implementations of the RTE.
 * @param customOptions Custom Froala options.
 */
const mergeWithCustomEvents = (defaultEvents: Partial<FroalaEvents>, customOptions: Partial<FroalaOptions>) => {
    
    // Check if custom event implementations are defined
    if (typeof customOptions.events !== "object") {
        return defaultEvents;
    }

    // Make a copy of the events to keep the function pure...
    const events = { ...defaultEvents } as FroalaEventsOption;
    const customEvents = { ...customOptions.events } as FroalaEventsOption

    // Iterate over default events
    for (const eventName in events) {
        const customEvent = customEvents[eventName];

        // Check if same custom event implementation exists
        if (typeof customEvent === "function") {
            const defaultEvent = events[eventName];

            // Wrap the custom implementation call with the default first
            // Use regular function expression instead of arrow function, so that Froala can bind 'this' to the editor instance
            events[eventName] = function (this: FroalaEditor, ...args: any[]) {
                defaultEvent.call(this, ...args);
                customEvent.call(this, ...args);
            };

            // Delete the custom event once it's wrapped with the default implementation,
            // so that it doesn't overwrite itself during the merge...
            delete customEvents[eventName];
        }
    }

    // Merge the rest of the events which don't collide with the default's implementation
    return {
        ...events,
        ...customEvents
    };
}
