import { PageBuilder } from "./page-builder";
import { ModalDialog } from "./modal-dialog";

export interface Kentico {
    /**
     * Page builder.
     */
    readonly pageBuilder: PageBuilder;

    /**
     * Modal dialog.
     */
    readonly modalDialog: ModalDialog;
}