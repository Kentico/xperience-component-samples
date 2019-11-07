import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";

import { DialogMode } from "../plugin-types";

export interface LinkDescriptor {
  readonly linkText: string;
  readonly path: string;
  readonly openInNewTab: boolean;
}

export interface ExternalLinkDescriptor {
  readonly linkUrl: string;
  readonly linkText: string;
  readonly openInNewTab: boolean;
}

export interface LinkPlugin extends CustomPlugin {
  readonly showLinkPopup: (relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, dialogMode?: DialogMode) => void;
  readonly showExternalLinkPopup: (relatedElementPosition: DOMRect | ClientRect, externalLinkDescriptor: ExternalLinkDescriptor, dialogMode?: DialogMode) => void;
  readonly hideLinkConfigurationPopup: () => void;
}

export interface PathSelectorMetadata {
  readonly name: string;
  readonly nodeGuid: string
}
