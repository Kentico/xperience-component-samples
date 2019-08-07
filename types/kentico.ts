type InlineEditorLifecycleCallback = (options: InlineEditorOptions) => void;

interface InlineEditorOptions {
  readonly editor: HTMLElement;
  readonly localizationService: LocalizationService;
  readonly propertyValue: string;
  readonly propertyName: string;
}

interface LocalizationService {
  readonly cultureCode: string;
  getString: (resourceString: string, ...parameters: any[]) => string;
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
}
