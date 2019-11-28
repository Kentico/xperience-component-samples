using Kentico.Components.Web.Mvc.Widgets.Controllers;

namespace Kentico.Components.Web.Mvc.Widgets.Models
{
    /// <summary>
    /// Represents configurable options of the rich text widget.
    /// </summary>
    public class RichTextWidgetOptions
    {
        /// <summary>
        /// Configuration name for the underlying inline editor.
        /// </summary>
        public string ConfigurationName { get; set; } = KenticoRichTextWidgetController.IDENTIFIER;
    }
}
