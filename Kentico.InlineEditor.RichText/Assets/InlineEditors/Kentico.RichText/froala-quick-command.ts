import { RegisterQuickInsertButton, DefineIcon } from "froala-editor/js/froala_editor.pkgd.min";
import { FroalaCommand } from "./froala-command";

/**
 * Represents a Froala quick command.
 */
export class FroalaQuickCommand extends FroalaCommand {
    /**
     * Registers the quick command into Froala.
     */
    register() {
        RegisterQuickInsertButton(this.commandName, this.commandParameters);

        if (this.commandIcon) {
            DefineIcon(this.commandIcon.iconName, this.commandIcon.iconParameters);
        }
    }
}