import { FroalaOptions, ToolbarButtons } from "froala-editor/js/froala_editor.pkgd.min";

import { formComponentOptionsModifier } from "../options-modifier";

describe("formComponentOptionsModifier", () => {
    const toolbar = ["bold", "fullscreen", "italic", "|", "fullscreen", "underline"];
    const expectedToolbar = ["bold", "italic", "|", "underline"];
    const expectedIframeStyle = ".ktc-macro { cursor: pointer; border: 1px solid black; border-radius: 3px; padding: 0 4px; background-color: #e5e5e5;} .ktc-macro:hover { -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.75); box-shadow: 0 0 3px rgba(0, 0, 0, 0.75);}";

    it("should add/overwrite iframe style", () => {
        const options: Partial<FroalaOptions> = {};

        formComponentOptionsModifier(options);

        expect(options.iframeStyle).toEqual(expectedIframeStyle);
    });

    it("should remove 'fullscreen' entries from an array type toolbar configuration", () => {
        const options: Partial<FroalaOptions> = {
            toolbarButtons: [...toolbar]
        }
        
        formComponentOptionsModifier(options);

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
        
        formComponentOptionsModifier(options);
        const toolbarButtons = options.toolbarButtons as Partial<ToolbarButtons>

        expect(toolbarButtons.moreText?.buttons).toEqual(expectedToolbar);
        expect(toolbarButtons.moreParagraph?.buttons).toEqual(expectedToolbar);
        expect(toolbarButtons.moreRich?.buttons).toEqual(expectedToolbar);
        expect(toolbarButtons.moreMisc?.buttons).toEqual(expectedToolbar);
    });
});