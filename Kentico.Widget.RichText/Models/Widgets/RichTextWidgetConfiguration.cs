using Kentico.Components.Web.Mvc.InlineEditors;

namespace Kentico.Components.Web.Mvc.Widgets
{
    /// <summary>
    /// Represents configuration of the rich text widget.
    /// </summary>
    public class RichTextWidgetConfiguration
    {
        /// <summary>
        /// Configuration name for the underlying inline editor.
        /// </summary>
        public string ConfigurationName { get; set; } = RichTextInlineEditorConstants.DEFAULT_CONFIGURATION_NAME;
    }
}
