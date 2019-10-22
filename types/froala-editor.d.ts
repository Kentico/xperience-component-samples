
// TEMP: Temporary type definitions until Froala provides their official type definitions

declare module 'froala-editor/js/froala_editor.pkgd.min' {
    import { MACROS_PLUGIN_NAME } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/plugins/macros/macro-constants";
    import { LinkPlugin } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/plugins/links/link-types";
    import { LINK_PLUGIN_NAME } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/plugins/links/link-constants";
    import { MacrosPlugin } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/plugins/macros/macro-types";
    
    /**
     * Define a custom icon.
     *
     * @param name Label given to this icon to be used in registering commands etc...
     * @param parameters The parameters required to inject the icon into the template library's html template
     */
    export function DefineIcon(name: string, parameters: Partial<DefineIconParameters>): void;
  
    export interface DefineIconParameters {
      /**
       * Template to be used to resolve the icon. Default is font_awesome.
       * The values passed from DefineIconParameters will be injected into this templates html via parameter expansion.
       */
      template: string;
  
      /**
       * Default parameters available. Refer to ICON_TEMPLATES for more info.
       */
      NAME: string;
      SRC: string;
      ALT: string;
      FA5NAME: string;
      SVG_KEY: string;
      PATH: string,
    }
  
    /**
     * Set the default icon template.
  
     * By default the editor is using the font_awesome template but that can be changed.
     */
    export const ICON_DEFAULT_TEMPLATE: string;
  
    /**
     * Default icon templates.
     * When the editor renders an icon it is using one of the templates defined. By default the editor comes
     * with 3 templates: FontAwesome font, text and image.
     *
     *  FroalaEditor.ICON_TEMPLATES = {
     *     font_awesome: '<i class="fa fa-[NAME]" aria-hidden="true"></i>,',
     *     font_awesome_5: '<i class="fas fa-[FA5NAME]" aria-hidden="true"></i>',
     *     font_awesome_5s: '<i class="far fa-[FA5NAME]" aria-hidden="true"></i>',
     *     text: '<span style="text-align: center;">[NAME]</span>',
     *     image: '<img src=[SRC] alt=[ALT] />',
     *     svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">[PATH]</svg>'
     *   }
     */
    export const ICON_TEMPLATES: GenericObject<string>;

    export const POPUP_TEMPLATES: GenericObject<string>
  
    /**
     * Registers a button
     *
     * Once a command is defined it can be included in any option that is using buttons:
     * - imageAltButtons
     * - imageEditButtons
     * - imageInsertButtons
     * - imageSizeButtons
     * - linkEditButtons
     * - linkInsertButtons
     * - tableColorsButtons
     * - tableEditButtons
     * - tableInsertButtons
     * - toolbarButtons
     * - toolbarButtonsMD
     * - toolbarButtonsSM
     * - toolbarButtonsXS
     * - videoEditButtons
     * - videoInsertButtons or videoSizeButtons
     *
     * @param name Label given to the command to be used in registering in button options
     * @param parameters
     */
    export function RegisterCommand(name: string, parameters: Partial<RegisterCommandParameters>): void;
  
  
    export interface RegisterCommandParameters {
      // Button title.
      title: string;
  
      // Specify the icon for the button.
      // If this option is not specified, the button name will be used.
      icon?: string;
  
      // Save the button action into undo stack.
      undo: boolean;
  
      // Focus inside the editor before the callback.
      focus: boolean;
      
      // Buttons which are included in the editor toolbar should have the plugin property set.
      plugin?: string, 
  
      // Show the button on mobile or not.
      showOnMobile?: boolean;
  
      // Refresh the buttons state after the callback.
      refreshAfterCallback?: boolean;
  
      // Called when the button is hit.
      // The current context is the editor instance.
      callback: (buttonName: string) => void;
  
      // Called when the button state might have changed.
      refresh?: (button: JQuery) => void;
    }
  
    /**
     *
     * @param keyCode Key code of the key pressed
     * @param command Command that should be triggered
     * @param commandValue Value passed to the command
     * @param shortcutLetter The letter to be shown in the tooltip for shortcut
     * @param shiftKeyRequired Shortcut needs to have the SHIFT key pressed
     * @param optionKeyRequired Shortcut needs to have the OPTION key pressed
     */
    export function RegisterShortcut(
      keyCode: number,
      command: string,
      commandValue: any,
      shortcutLetter?: string,
      shiftKeyRequired?: boolean,
      optionKeyRequired?: boolean
    ): void;
  
    /**
     * Register a placeholder for injecting templates into the editor's html
     * @param name Name of Template
     * @param template HTML to inject
     */
    export function RegisterTemplate(
      name: string,
      template: string
    ): void
  
    // Froala config defaults
    export const DEFAULTS: Partial<FroalaOptions>;
  
    export interface CustomPlugin extends GenericObject {
      _init?(): void;
    }
  
    // Froala Plugins
    export const PLUGINS: GenericObject<(editor: FroalaEditor) => CustomPlugin>;
  
    export function RegisterQuickInsertButton(name: string, parameters: object): void;
    export function DefineIconTemplate(name: string, template: string): void;
  
    export default class FroalaEditor {
      constructor(element: any, options: Partial<FroalaOptions>);
      $oel: JQuery;
      $tb: JQuery;
      destroy(): object;

      // Custom props
      [MACROS_PLUGIN_NAME]: MacrosPlugin;
      [LINK_PLUGIN_NAME]: LinkPlugin;

      accessibility: Accessibility;
      align: Align;
      button: Button;
      charCounter: ChartCounter;
      clean: Clean;
      codeView: CodeView;
      colors: Colors;
      commands: Commands;
      core: Core;
      cursor: Cursor;
      edit: Edit;
      editInPopup: EditInPopup;
      el: HTMLElement;      
      embedly: Embedly;
      emoticons: Emoticons;
      events: Events;
      file: File;
      fontFamily: FontFamily;
      fontSize: FontSize;
      format: Format;
      forms: Forms;
      fullscreen: Fullscreen;
      helpers: Helpers;
      html: HTML;
      image: Image;
      inlineClass: InlineClass;
      inlineStyle: InlineStyle;
      keys: Keys;
      language: Language;
      lineHeight: LineHeight;
      link: Link;
      lists: Lists;
      markers: Markers;
      modals: Modals;
      node: Node;
      opts: FroalaOptions;      
      paragraphFormat: Apply<string>;
      paragraphStyle: Apply<string>;
      placeholder: Placeholder;
      popups: Popups;
      position: Position;
      quote: Apply<string>;
      save: Save;
      selection: FroalaSelection;
      size: Size;
      snapshot: Snapshot;
      spellChecker: SpellChecker;
      table: Table;
      toolbar: Toolbar;
      tooltip: Tooltip;
      undo: Undo;
      video: Video;
    }
  
    export type GenericObject<T = any> = { [key: string]: T; };
  
    export interface ToolbarButtons {
      [key: string]: {
        buttons: string[];
        align?: string;
        buttonsVisible?: number;
      };
    }
  
    export interface EmoticonButton {
      code: string;
      desc: string;
    }
  
    export type UploadMethod = 'POST' | 'PUT';
    export type DeleteMethod = 'POST' | 'DELETE';
    export type GetMethod = 'POST' | 'GET';
  
    export interface SpecialCharacterSet {
      title: string;
      list: {
        char: string;
        desc: string;
      }[];
    }
  
    export interface FroalaOptions {
      [x: string]: any,
      // Aviary Editor
      aviaryKey: boolean,
      aviaryOptions: { [key: string]: any },
  
      // Char Counter
      charCounterCount: boolean,
      charCounterMax: number,
  
      // Code Beautifier
      codeBeautifierOptions: GenericObject,
  
      // Code View
      codeMirror: object,
      codeMirrorOptions: GenericObject,
      codeViewKeepActiveButtons: string[],
  
      // Colors
      colorsBackground: string[],
      colorsButtons: string[],
      colorsHEXInput: boolean,
      colorsStep: number,
      colorsText: string[],
  
      // Draggable
      dragInline: boolean,
  
      // Events
      events: Partial<FroalaEvents>,
  
      // Embedly
      embedlyEditButtons: string[],
      embedlyInsertButtons: string[],
      embedlyKey: string,
      embedlyScriptPath: string,
  
      // Emoticons
      emoticonsButtons: string[],
      emoticonsSet: EmoticonButton[],
      emoticonsStep: number,
      emoticonsUseImage: boolean,
  
      // Entities
      entities: string,
  
      // File
      fileAllowedTypes: string[],
      fileInsertButtons: string[],
      fileMaxSize: number,
      fileUpload: boolean,
      fileUploadMethod: UploadMethod,
      fileUploadParam: string,
      fileUploadParams: object,
      fileUploadToS3: object,
      fileUploadURL: string,
      fileUseSelectedText: boolean,
  
      // Font Family
      fontFamily: GenericObject,
      fontFamilyDefaultSelection: string,
      fontFamilySelection: boolean,
  
      // Font Size
      fontSize: string[],
      fontSizeDefaultSelection: string,
      fontSizeSelection: boolean,
      fontSizeUnit: string,
  
      // Form
      formEditButtons: string[],
      formMultipleStyles: boolean,
      formStyles: GenericObject,
      formUpdateButtons: string[],
  
      // Licensing
      key: string,
  
      // General
      attribution: boolean,
      autofocus: boolean,
      direction: 'auto' | 'ltr' | 'rtl',
      disableRightClick: boolean,
      documentReady: boolean,
      editInPopup: boolean,
      editorClass: string,
      enter: string,
      fullPage: boolean,
      height: number,
      heightMax: number,
      heightMin: number,
      htmlAllowComments: boolean,
      htmlAllowedAttrs: string[],
      htmlAllowedEmptyTags: string[],
      htmlAllowedStyleProps: string[],
      htmlAllowedTags: string[],
      htmlDoNotWrapTags: string[],
      htmlExecuteScripts: boolean,
      htmlIgnoreCSSProperties: string[],
      htmlRemoveTags: string[],
      htmlSimpleAmpersand: boolean,
      htmlUntouched: boolean,
      iconsTemplate: string,
      iframe: boolean,
      iframeDefaultStyle: string,
      iframeStyle: string,
      iframeStyleFiles: string[],
      indentMargin: number,
      initOnClick: boolean,
      keepFormatOnDelete: boolean,
      multiLine: boolean,
      pasteAllowLocalImages: boolean,
      pasteAllowedStyleProps: string[],
      pasteDeniedAttrs: string[],
      pasteDeniedTags: string[],
      pastePlain: boolean,
      placeholderText: string,
      pluginsEnabled: string[],
      requestHeaders: GenericObject<string>,
      requestWithCORS: boolean,
      requestWithCredentials: boolean,
      scrollableContainer: string,
      shortcutsEnabled: string[],
      shortcutsHint: boolean,
      spellcheck: boolean,
      tabIndex: number,
      tabSpaces: number,
      theme: string,
      toolbarBottom: boolean,
      toolbarButtons: Partial<ToolbarButtons>,
      toolbarButtonsMD: Partial<ToolbarButtons>,
      toolbarButtonsSM: Partial<ToolbarButtons>,
      toolbarButtonsXS: Partial<ToolbarButtons>,
      toolbarContainer: string,
      toolbarInline: boolean,
      toolbarSticky: boolean,
      toolbarStickyOffset: number,
      toolbarVisibleWithoutSelection: boolean,
      tooltips: boolean,
      typingTimer: number,
      useClasses: boolean,
      width: string,
      zIndex: number,
  
      // Help
      helpSets: object[],
  
      // Image
      imageAddNewLine: boolean,
      imageAllowedTypes: string[],
      imageAltButtons: string[],
      imageCORSProxy: string,
      imageDefaultAlign: MediaAlign,
      imageDefaultDisplay: DisplayType,
      imageDefaultMargin: number,
      imageDefaultWidth: number,
      imageEditButtons: string[],
      imageInsertButtons: string[],
      imageMaxSize: number,
      imageMinWidth: number,
      imageMove: boolean,
      imageMultipleStyles: boolean,
      imageOutputSize: boolean,
      imagePaste: boolean,
      imagePasteProcess: boolean,
      imageResize: boolean,
      imageResizeWithPercent: boolean,
      imageRoundPercent: boolean,
      imageSizeButtons: string[],
      imageSplitHTML: boolean,
      imageStyles: GenericObject<string>,
      imageTUIOptions: object,
      imageTextNear: boolean,
      imageUpload: boolean,
      imageUploadMethod: UploadMethod,
      imageUploadParam: string,
      imageUploadParams: object,
      imageUploadRemoteUrls: boolean,
      imageUploadToS3: object,
      imageUploadURL: string,
  
      // Image Manager
      imageManagerDeleteMethod: DeleteMethod,
      imageManagerDeleteParams: object,
      imageManagerDeleteURL: string,
      imageManagerLoadMethod: GetMethod,
      imageManagerLoadParams: object,
      imageManagerLoadURL: string,
      imageManagerPageSize: number,
      imageManagerPreloader: string,
      imageManagerScrollOffset: number,
      imageManagerToggleTags: boolean,
  
      // Inline Style
      inlineStyles: GenericObject<string>,
  
      // Inline Class
      inlineClasses: GenericObject<string>,
  
      // Language
      language: string,
  
      // Line Breaker
      lineBreakerHorizontalOffset: number,
      lineBreakerOffset: number,
      lineBreakerTags: string[],
  
      // Link
      linkAlwaysBlank: boolean,
      linkAlwaysNoFollow: boolean,
      linkAttributes: GenericObject,
      linkAutoPrefix: string,
      linkConvertEmailAddress: boolean,
      linkEditButtons: string[],
      linkInsertButtons: string[],
      linkList: GenericObject<string>[],
      linkMultipleStyles: boolean,
      linkNoOpener: boolean,
      linkNoReferrer: boolean,
      linkStyles: GenericObject<string>,
      linkText: boolean,
  
      // Paragraph Format
      lineHeights: GenericObject<string>,
      paragraphDefaultSelection: string,
      paragraphFormat: GenericObject<string>,
      paragraphFormatSelection: boolean,
      paragraphMultipleStyles: boolean,
      paragraphStyles: GenericObject<string>,
  
      // Lists
      listAdvancedTypes: boolean,
  
      // Quick Insert
      quickInsertButtons: string[],
      quickInsertEnabled: boolean,
      quickInsertTags: string[],
  
      // Font Awesome
      faButtons: string[],
      fontAwesomeSets: object,
      fontAwesomeTemplate: string,
  
      // Special Characters
      specialCharButtons: string[],
      specialCharactersSets: SpecialCharacterSet[],
  
      // SCAYT Spell Checker
      scaytAutoload: boolean,
      scaytCustomerId: string,
      scaytOptions: object,
  
      // Save
      saveInterval: number,
      saveMethod: UploadMethod,
      saveParam: string,
      saveParams: object,
      saveURL: string,
  
      // Table
      tableCellMultipleStyles: boolean,
      tableCellStyles: GenericObject<string>,
      tableColors: string[],
      tableColorsButtons: string[],
      tableColorsStep: number,
      tableDefaultWidth: string,
      tableEditButtons: string[],
      tableInsertButtons: string[],
      tableInsertHelper: boolean,
      tableInsertHelperOffset: number,
      tableInsertMaxSize: number,
      tableMultipleStyles: boolean,
      tableResizer: boolean,
      tableResizerOffset: number,
      tableResizingLimit: number,
      tableStyles: GenericObject<string>,
  
      // Video
      videoAllowedProviders: string[],
      videoAllowedTypes: string[],
      videoDefaultAlign: MediaAlign,
      videoDefaultDisplay: DisplayType,
      videoDefaultWidth: number,
      videoEditButtons: string[],
      videoInsertButtons: string[],
      videoMaxSize: number,
      videoMove: boolean,
      videoResize: boolean,
      videoResponsive: boolean,
      videoSizeButtons: boolean,
      videoSplitHTML: boolean,
      videoTextNear: boolean,
      videoUpload: boolean,
      videoUploadMethod: UploadMethod,
      videoUploadParam: string,
      videoUploadParams: object,
      videoUploadToS3: boolean,
      videoUploadURL: string,
  
      // Word
      wordAllowedStyleProps: string[],
      wordDeniedAttrs: string[],
      wordDeniedTags: string[],
      wordPasteKeepFormatting: boolean,
      wordPasteModal: boolean,
    }
  
    export interface FroalaEvents {
      blur: () => void,
      click: (clickEvent: any) => void,
      contentChanged: () => void,
      destroy: () => void,
      drop: (dropEvent: JQueryEventObject) => void,
      focus: () => void,
      initialized: () => void,
      initializationDelayed: () => void,
      input: (inputEvent: JQueryInputEventObject) => void,
      keydown: (keydownEvent: JQueryKeyEventObject) => void,
      keypress: (keypressEvent: JQueryKeyEventObject) => void,
      keyup: (keyupEvent: JQueryKeyEventObject) => void,
      mousedown: (mousedownEvent: JQueryMouseEventObject) => void,
      mouseup: (mouseupEvent: JQueryMouseEventObject) => void,
      shortcut: (event: Event, commandName: string, shortcutValue: any) => void,
      touchstart: (touchstartEvent: JQueryEventObject) => void,
      touchend: (touchendEvent: JQueryEventObject) => void,
      "html.set": () => void;
    }
  
    interface Apply<T> {
      apply(value: T): void;
    }
  
    export type MediaAlign = 'left' | 'right' | 'center';
    export type AlignType = 'left' | 'right' | 'center' | 'justify';
  
    export interface Accessibility {
      _init: () => void;
      registerPopup: (e: any) => void;
      registerToolbar: (r: any) => void;
      focusToolbarElement: (t: any) => void;
      focusToolbar: (e: any, t: any) => void;
      focusContent: (e: any, t: any) => void;
      focusPopup: (r: JQuery) => void;
      focusModal: (e: any) => void;
      focusEditor: () => void;
      focusPopupButton: (e: any) => void;
      focusModalButton: (e: any) => void;
      hasFocus: () => boolean;
      exec: (e: any, t: any) => void;
      saveSelection: () => void;
      restoreSelection: () => void;
    }

    export interface Align {
      // Set the alignment of the selected paragraphs.
      apply(alignType: AlignType): object;
      // Refresh the alignment of the selected paragraphs.
      refresh(button: Element): object;
    }
  
    export interface Button {
      // Adds buttons into existing toolbar.
      addButton(buttons: Commands[]): object;
      // Refreshes the state of the buttons in the toolbar.
      bulkRefresh(): void;
      // Builds a list of commands to a button list represented as a HTML string.
      buildList(buttons: Commands[]): object;
      // Builds a list of commands to a button list represented as a HTML string.
      bulkGroup(): void;
      // Attaches the event callbacks.
      bindCommands(element: Element): void;
      // Refreshes the state of active command/button.
      refresh(button: Element): void;
      // Hides all the active dropdowns.
      hideActiveDropdowns(element: Element): void;
    }
  
    export interface ChartCounter {
      // Returns the number of characters in the editor.
      count(): number;
    }
  
    export interface Clean {
      // Cleans dirty HTML to clean HTML ready to be inserted into the editor.
      html(dirtyHtml: string): string;
      // Cleans the tables.
      tables(): void
      // Cleans the lists.
      lists(): void;
      // Cleans the invisible spaces.
      invisibleSpaces(dirtyHtml: string): void;
    }
  
    export interface CodeView {
      // Find if code view mode is active.
      isActive(): boolean;
      // Get the HTML edited inside the code view mode.
      get(): string;
      // Toggle between the code and text view.
      toggle(): object;
    }
  
    export interface Colors {
      // Set the background color of the selected text.
      background(color: string): object;
      // Set the text color of the selected text.
      text(value: string): object;
      // Hides the color picker popup.
      back(): void;
    }
  
    export interface Commands {
      // Format the selected text as bold.
      bold(): object;
      // Clean any formatting on the selected text.
      clearFormatting(): object;
      // Indent more the selected paragraphs.
      indent(): object;
      // Insert a horizontal line at the cursor position.
      insertHR(): object;
      // Format the selected text as italic.
      italic(): object;
      // Indent less the selected paragraphs.
      outdent(): object;
      // Executes the redo action.
      redo(): object;
      // Show the inline toolbar at the cursor position.
      show(): object;
      // Format the selected text as strike through.
      strikeThrough(): object;
      // Format the selected text as subscript.
      subscript(): object;
      // Format the selected text as superscript.
      superscript(): object;
      // Format the selected text as underline.
      underline(): object;
      // Executes the undo action.
      undo(): object;
      // Executes the selectAll action.
      selectAll(): object;
      // Show more text actions toolbar.
      moreText(): object;
      // Show more paragraph actions toolbar.
      moreParagraph(): object;
      // Show more rich text actions toolbar.
      moreRich(): object;
      // Show more miscellaneous actions toolbar.
      moreMisc(): object;
    }
  
    export interface Core {
      // Creates a XHR object with the specified parameters.
      getXHR(url: string, method: string): XMLHttpRequest;
      // CSS style to be injected inside the iframe of the editor when the iframe option is used.
      injectStyle(style: string): object;
      // Check if the editor is empty.
      isEmpty(): boolean;
      // Check if the both editor instances are same.
      sameInstance(object: Element): boolean;
    }
  
    export interface Cursor {
      // Trigger backspace action at the cursor position.
      backspace(): object;
      // Trigger enter action at the cursor position.
      enter(shiftPressed: boolean): object;
      // Trigger delete action at the cursor position.
      del(): object;
      // Find if the cursor is at the end.
      isAtEnd(): boolean;
      // Find if the cursor is at the start.
      isAtStart(): boolean;
    }
  
    export interface Edit {
      // Disable editor by removing the contenteditable attribute.
      off(): object;
      // Enable editor by adding the contenteditable attribute.
      on(): object;
      // Find if the edit is disabled.
      isDisabled(): boolean;
      // Disables the edit functionality.
      disableDesign(): void;
    }
  
    export interface EditInPopup {
      // Update the texts in popup.
      update(): void;
    }
  
    export interface Embedly {
      // Add the embedly to editor.
      add(url: string): void;
      // Hides the insert popup and shows inline menu for currently selected embedly.
      back(): void;
      // Gets the currently embedly instance.
      get(): void;
      // Inserts the embedly into editor from popup.
      insert(): void;
      // Removes the currently selected embedly instance.
      remove(): void;
      // Shows insert popup.
      showInsertPopup(): void;
    }
  
    export interface Emoticons {
      // Insert an emoticon at the cursor position.
      insert(emoticon: string, image?: string): object;
      // Insert an emoticon at the cursor position.
      setEmoticonCategory(categoryId: string): void;
    }
  
    export interface Events {
      // Check if blur events are active.
      blurActive(): boolean;
      // Binds the click event for given element.
      bindClick(element: Element, selector: string, handler: () => void): void;
      // Trigger events and chain the pass the returned value between the assigned events.
      chainTrigger(name: string, eventParams: object, force: boolean): object;
      // Disables the blur and focus events.
      disableBlur(): object;
      // Enables the blur and focus events.
      enableBlur(): object;
      // Focus into the editor.
      focus(): object;
      // Register an event.
      on(name: string, callback: (event: Event) => void | boolean, first: boolean): object;
      // Triggers an event.
      trigger(name: string, args: any[], force: boolean): object;
    }
  
    export interface File {
      // Insert the link to a file at the cursor position.
      insert(link: string, text: string, response: object): object;
      // Upload the passed file to the server.
      upload(files: any[]): object;
    }
  
    export interface FontFamily extends Apply<string> { }
  
    export interface FontSize extends Apply<string> { }
  
    export type FormatAttributes = { [key: string]: any; };
    export interface Format {
      // Apply format for the selection or at the insertion point.
      apply(tagName: string, attributes: FormatAttributes): object;
      // Apply style for the selection or at the insertion point.
      applyStyle(cssProperty: string, cssAttributes: string | FormatAttributes): object;
      // Check format for the selection or at the insertion point.
      is(tagName: string, attributes: FormatAttributes): boolean;
      // Remove format for the selection or at the insertion point.
      remove(tagName: string, attributes: FormatAttributes): object;
      // Remove style for the selection or at the insertion point.
      removeStyle(cssPropertyName: string): object;
      // Toggle format for the selection or at the insertion point.
      toggle(tagName: string, attributes: FormatAttributes): object;
    }
  
    export interface Fullscreen {
      // Check the fullscreen state.
      isActive(): boolean;
      // Toggle fullscreen mode.
      toggle(): object;
    }
  
    export interface Forms {
      applyStyle(className: string, formStyles: object, formMultipleStyles: boolean): void;
  
    }
  
    export interface Helpers {
      isMobile(): boolean;
      isAndroid(): boolean;
      isBlackberry(): boolean;
      isIOS(): boolean;
      isMac(): boolean;
      isTouch(): boolean;
      isWindowsPhone(): boolean;
      scrollLeft(): number;
      scrollTop(): number;
      sanitizeURL(url: string): string;
    }
  
    export interface HTML {
      cleanEmptyTags(): object;
      get(keepMarkers?: boolean, keepClasses?: boolean): string;
      getSelected(): string;
      unwrap(): void;
      wrap(temp?: boolean, tables?: boolean, blockquote?: boolean): void;
      insert(html: string, clean?: boolean, doSplit?: boolean): object;
      set(html: string): object;
    }
  
    export type DisplayType = 'block' | 'inline';
  
    export interface Image {
      align(alignType: AlignType): object;
      applyStyle(className: string): object;
      display(displayType: DisplayType): any ;
      get(): object;
      insert(link: string, sanitize?: boolean, data?: { [key: string]: any }, existingImage?: any, response?: object): object;
      remove(image: any): object;
      setAlt(alternateText: string): object;
      setSize(width: string, height: string): object;
      upload(images: any[]): object;
    }
  
    export interface ImageManager {
      hide(): object;
      show(): object;
    }
  
    export interface InlineClass extends Apply<string> { }
  
    export interface InlineStyle extends Apply<string> { }
  
    export interface Keys {
      ctrlKey(event: JQueryEventObject): boolean;
      isArrow(keyCode: number): boolean;
      isCharacter(keyCode: number): boolean;
    }
  
    export interface Language {
      translate(str: string): string;
    }
  
    export interface LineHeight extends Apply<number> { }
  
    export interface Link {
      allSelected(): Element[];
      applyStyle(className: string): object;
      get(): Element;
      insert(href: string, text?: string, attributes?: { [key: string]: any }): object
      remove(): object;
    }
  
    export type ListType = 'OL' | 'UL';
  
    export interface Lists {
      format(listType: ListType): object;
    }
  
    export interface Markers {
      insert(): object;
      insertAtPoint(event: JQueryEventObject): void;
      place(range: Range, marker?: boolean, id?: string): object;
      remove(): object;
      split(): object;
    }
  
    export interface Modals {
      areVisible(modalInstance: Element): boolean;
      create(id: string, headTemplate: string, bodyTemplate: string): Element;
      get(id: string): Element;
      isVisible(id: string): boolean;
      show(id: string): void;
      hide(id: string, restoreSelection: boolean): void;
    }
  
    export interface Node {
      blockParent(node: Element): Element;
      clearAttributes(node: Element): Element;
      contents(node: Element): any[];
      deepestParent(node: Element, until?: Element, simpleEnter?: boolean): Element;
      hasClass(element: Element, className: string): boolean;
      hasFocus(node: Element): boolean;
      isBlock(node: Element): boolean;
      isElement(node: Element): boolean;
      isDeletable(node: Element): boolean;
      isEditable(node: Element): boolean;
      isEmpty(node: Element, ignoreMarkers?: boolean): boolean;
      isFirstSibling(node: Element, ignoreMarkers?: boolean): boolean;
      isLastSibling(node: Element, ignoreMarkers?: boolean): boolean;
      isList(node: Element, ignoreMarkers?: boolean): boolean;
      isVoid(node: Element): boolean;
    }
  
    export interface ParagraphFormat extends Apply<string> { }
  
    export interface ParagraphStyle extends Apply<string> { }
  
    export interface Placeholder {
      hide(): void;
      isVisible(): void;
      refresh(): object;
      show(): void;
    }
  
    export interface Popups {
      // TODO: Documentation looks incorrect for this. Should be a boolean with arguments
      areVisible(): void;
      create(id: string, templateProperties: { [key: string]: any }): JQuery;
      get(id: string): JQuery;
      hide(id: string): boolean;
      hideAll(except?: string): object;
      isVisible(id: string): boolean;
      onHide(id: string, callback: () => void): object;
      onRefresh(id: string, callback: () => void): object;
      refresh(id: string): object;
      setContainer(id: string, container: JQuery): void;
      show(id: string, leftOffset: number, topOffset: number, heigh: number): object;
    }
  
    export interface Position {
      getBoundingRect(): DOMRect;
      refresh(): object;
    }
  
    export interface Quote extends Apply<string> {}
  
    export interface Save {
      force(): object;
      save(): object;
      reset(): object;
    }
  
    export interface FroalaSelection {
      blocks(): Element[];
      clear(): object;
      element(): HTMLElement;
      endElement(): Element;
      get(): Selection;
      inEditor(): boolean;
      info(element: Element): object;
      isCollapsed(): boolean;
      isFull(): boolean;
      ranges(index?: number): Range | Range[];
      restore(): object;
      save(): object;
      setAfter(node: Element): object;
      setAtEnd(node: Element): object;
      setAtStart(node: Element): object;
      setBefore(node: Element): object;
      text(): string;
    }
  
    export interface Size {
      refresh(): object;
      syncIframe(): object;
    }
  
    export interface Snapshot {
      equal(snapshot1: Snapshot, snapshot2: Snapshot): boolean;
      get(): Snapshot;
      restore(snapshot: Snapshot): object;
    }
  
    export interface SpellChecker {
      toggle(): void;
    }
  
    export interface Table {
      insert(rows: number, columns: number): object;
    }
  
    export interface Toolbar {
      enable(): object;
      disable(): object;
      hide(): object;
      show(): object;
      showInline(element?: Element, force?: boolean): object;
    }
  
    export interface Tooltip {
      bind(element: Element, selector: string, displayAbove?: boolean): object;
      hide(): object;
      to(element: Element, displayAbove?: boolean): object;
    }
  
    export interface Undo {
      canDo(): boolean;
      canRedo(): boolean;
      reset(): object;
      saveStep(): object;
    }
  
    export interface Video {
      align(alignType: AlignType): object;
      display(displayType: DisplayType): object;
      get(): JQuery;
      insert(embeddedCode: string): object;
      remove(): object;
      setSize(width: string, height: string): object;
    }
  }
