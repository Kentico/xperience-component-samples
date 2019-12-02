namespace Kentico.Components.Web.Mvc.Widgets.Models
{
    /// <summary>
    /// Rich text widget view model.
    /// </summary>
    public class RichTextWidgetViewModel
    {
        /// <summary>
        /// Name of the widget property which holds the editor content.
        /// </summary>
        public string ContentPropertyName { get; set; }


        /// <summary>
        /// Rich text editor content.
        /// </summary>
        public string Content { get; set; }


        /// <summary>
        /// Configuration name for the underlying inline editor.
        /// </summary>
        public string ConfigurationName { get; set; }
    }
}
