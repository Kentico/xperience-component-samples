import { PageBuilder } from "./page-builder";
import { ModalDialog } from "./modal-dialog";
import { Localization } from "./localization";

export interface Kentico {
    /**
     * Page builder.
     */
    readonly pageBuilder: PageBuilder;

    /**
     * Modal dialog.
     */
    readonly modalDialog: ModalDialog;

    /**
     * Localization.
     */
    readonly localization: Localization;
}