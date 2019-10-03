export interface PathSelectorMetadata {
  readonly name: string;
  readonly nodeGuid: string
}
import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";

import { DialogMode } from "../plugin-types";

export interface LinkDescriptor {
    readonly linkText: string;
    readonly path: string;
    readonly openInNewTab: boolean;
}

export interface LinkPlugin extends CustomPlugin {
    readonly showLinkPopup: (relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, dialogMode?: DialogMode) => void;
    readonly hideLinkConfigurationPopup: () => void;
}