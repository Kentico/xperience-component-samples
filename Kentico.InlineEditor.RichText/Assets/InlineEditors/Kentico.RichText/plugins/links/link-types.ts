import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";

export interface LinkDescriptor {
    readonly linkText: string;
    readonly linkUrl: string;
    readonly openInNewTab: boolean;
}

export interface LinkPlugin extends CustomPlugin {
    readonly showInsertLinkPopup: (relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) => void;
    readonly showLinkConfigurationPopup: (relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) => Promise<void>;
    readonly hideLinkConfigurationPopup: () => void;
}

interface LinkMetadata {
    readonly name: string;
    readonly identifier: string;
}

export interface LinkInfo {
    readonly linkType: LinkType;
    readonly linkMetadata: LinkMetadata;
}

export enum LinkType {
    PAGE,
    EXTERNAL,
}