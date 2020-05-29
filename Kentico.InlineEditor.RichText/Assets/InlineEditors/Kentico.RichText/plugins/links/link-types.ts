import { CustomPlugin, Position } from "froala-editor/js/froala_editor.pkgd.min";
import { LinkDescriptor } from "./link-descriptor";
import { LinkModel } from "./link-model";

export interface LinkPlugin extends CustomPlugin {
    readonly showInsertLinkPopup: (linkDescriptor: LinkDescriptor, relatedElement?: () => Element) => void;
    readonly showLinkConfigurationPopup: (linkDescriptor: LinkDescriptor, linkModel: LinkModel) => void;
    readonly hideLinkConfigurationPopup: () => void;
}

export enum LinkType {
    PAGE,
    MEDIA,
    LOCAL,
    EXTERNAL,
}