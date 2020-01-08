import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";
import { LinkDescriptor } from "./link-descriptor";

export interface LinkPlugin extends CustomPlugin {
    readonly showInsertLinkPopup: (relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) => void;
    readonly showLinkConfigurationPopup: (relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) => Promise<void>;
    readonly hideLinkConfigurationPopup: () => void;
}

export enum LinkType {
    PAGE,
    MEDIA,
    LOCAL,
    EXTERNAL,
}