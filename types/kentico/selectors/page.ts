export interface Page {
    readonly nodeId: number;
    readonly nodeGuid: string;
    readonly nodeAliasPath: string;
    readonly namePath: string;
    readonly name: string;
    readonly url: string;
    readonly icon: string;
    readonly isValid: boolean;
}