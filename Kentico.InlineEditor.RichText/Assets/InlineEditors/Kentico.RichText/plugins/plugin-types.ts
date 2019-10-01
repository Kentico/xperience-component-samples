import * as f from "froala-editor/js/froala_editor.pkgd.min";

export type Froala = typeof f;

export enum PluginType {
  MacroPlugin,
  LinkPlugin
};


export enum DialogMode {
  INSERT,
  UPDATE
}

export interface LinkDescriptor {
  readonly linkText: string;
  readonly path: string;
  readonly openInNewTab: boolean;
}