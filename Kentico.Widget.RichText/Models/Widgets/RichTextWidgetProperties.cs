using Kentico.PageBuilder.Web.Mvc;

namespace Kentico.Components.Web.Mvc.Widgets
{
    /// <summary>
    /// Rich text widget properties.
    /// </summary>
    public class RichTextWidgetProperties : IWidgetProperties
    {
        /// <summary>
        /// Widget content.
        /// </summary>
        public string Content { get; set; }
    }
}
