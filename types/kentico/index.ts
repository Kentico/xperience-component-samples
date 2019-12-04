import * as f from "froala-editor/js/froala_editor.pkgd.min";

import { PageBuilder } from "./page-builder";
import { ModalDialog } from "./modal-dialog";
import { Localization } from "./localization";

export type Froala = typeof f;

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