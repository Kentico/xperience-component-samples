type InlineEditorLifecycleCallback = (options: InlineEditorOptions) => void;

interface InlineEditorOptions {
  readonly editor: HTMLElement;
  readonly localization: any;
  readonly propertyValue: string;
  readonly propertyName: string;
}

interface InlineEditor {
  readonly init: InlineEditorLifecycleCallback;
  readonly destroy?: InlineEditorLifecycleCallback;
}

interface PageBuilder {
  /**
   * Registers inline editor into page builder.
   */
  readonly registerInlineEditor: (name: string, definition: InlineEditor) => void;
}

export interface Kentico {
    readonly pageBuilder: PageBuilder;
    _initVideoWidget: any;
}
