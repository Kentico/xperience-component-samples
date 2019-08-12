interface InlineEditorOptions {
  /**
   * Inline editor instance wrapper element.
   */
  readonly editor: HTMLElement;

  /**
   * Localization service.
   */
  readonly localization: any;

  /**
   * Widget property value.
   */
  readonly propertyValue: string;

  /**
   * Widget property name on which the inline editor operates.
   */
  readonly propertyName: string;
}

interface InlineEditor {
  /**
   * Inline editor initialization lifecycle callback.
   */
  readonly init: (options: InlineEditorOptions) => void;

  /**
   * Inline editor destroy lifecycle callback.
   */
  readonly destroy?: (options: InlineEditorOptions) => void;

  /**
   * Inline editor drag start lifecycle callback.
   */
  readonly dragStart?: (options: InlineEditorOptions) => void;

  /**
   * Inline editor drop lifecycle callback.
   */
  readonly drop?: (options: InlineEditorOptions) => void;
}

interface Widget {
}

export interface PageBuilder {
  /**
   * Registers inline editor into page builder.
   */
  readonly registerInlineEditor: (name: string, definition: InlineEditor) => void;

  readonly _widget: Widget;
}

export interface Kentico {
    readonly pageBuilder: PageBuilder;
}
