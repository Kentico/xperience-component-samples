import { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { FroalaIcon } from "./froala-icon";

/**
 * Represents a Froala command.
 */
export class FroalaCommand {
    constructor(
        public readonly commandName: string,
        public readonly commandParameters: RegisterCommandParameters,
        public readonly commandIcon?: FroalaIcon,
    ) { }
}