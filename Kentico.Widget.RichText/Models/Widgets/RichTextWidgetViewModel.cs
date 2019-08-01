namespace Kentico.Components.Web.Mvc.Widgets.Models
{
    /// <summary>
    /// Rich text widget view model.
    /// </summary>
    public class RichTextWidgetViewModel
    {
        /// <summary>
        /// Name of the widget property to edit.
        /// </summary>
        public string PropertyName { get; set; }


        /// <summary>
        /// Widget property content.
        /// </summary>
        public string Content { get; set; }
    }
}
