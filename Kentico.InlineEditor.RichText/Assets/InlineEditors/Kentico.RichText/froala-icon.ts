import { DefineIconParameters } from "froala-editor/js/froala_editor.pkgd.min";

/**
 * Represents a Froala icon.
 */
export class FroalaIcon {
    constructor(
        public readonly iconName: string,
        public readonly iconParameters: Partial<DefineIconParameters>,
    ) { }
}