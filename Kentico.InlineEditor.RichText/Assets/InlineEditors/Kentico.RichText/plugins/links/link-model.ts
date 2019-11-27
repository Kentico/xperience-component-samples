import { LinkType } from "./link-types";

type LinkMetadata = Nullable<{
    readonly name: string;
    readonly identifier: string;
}>;

export class LinkModel {
    constructor(
        readonly linkType: LinkType,
        readonly linkURL: Nullable<string> = null,
        readonly linkMetadata: LinkMetadata = null
    ) {}
}
