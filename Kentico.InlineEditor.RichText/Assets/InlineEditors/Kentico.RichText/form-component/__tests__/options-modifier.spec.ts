import { FroalaOptions, ToolbarButtons } from "froala-editor/js/froala_editor.pkgd.min";

import { removeFullScreenMode } from "../options-modifier";

describe("removeFullScreenMode", () => {
    const toolbar = ["bold", "fullscreen", "italic", "|", "fullscreen", "underline"];
    const expectedToolbar = ["bold", "italic", "|", "underline"];

    it("should remove 'fullscreen' entries from an array type toolbar configuration", () => {
        const options: Partial<FroalaOptions> = {
            toolbarButtons: [...toolbar]
        }
        
        removeFullScreenMode(options);

        expect(options.toolbarButtons).toEqual(expectedToolbar);
    });

    it("should remove 'fullscreen' entries from an object type toolbar configuration", () => {
        const options: Partial<FroalaOptions> = {
            toolbarButtons: {
                moreText: {
                    buttons: [...toolbar],
                },
                moreParagraph: {
                    buttons: [...toolbar],
                },
                moreRich: {
                    buttons: [...toolbar],
                },
                moreMisc: {
                    buttons: [...toolbar],
                }
            },
        };
        
        removeFullScreenMode(options);
        const toolbarButtons = options.toolbarButtons as Partial<ToolbarButtons>

        expect(toolbarButtons.moreText?.buttons).toEqual(expectedToolbar);
        expect(toolbarButtons.moreParagraph?.buttons).toEqual(expectedToolbar);
        expect(toolbarButtons.moreRich?.buttons).toEqual(expectedToolbar);
        expect(toolbarButtons.moreMisc?.buttons).toEqual(expectedToolbar);
    });
});