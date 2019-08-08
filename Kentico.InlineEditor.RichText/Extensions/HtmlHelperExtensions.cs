using System;
using System.Web.Mvc;

using Kentico.PageBuilder.Web.Mvc;
using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    public static class HtmlHelperExtensions
    {
        private const string RICH_TEXT_EDITOR_NAME = "Kentico.InlineEditor.RichText";
        private const string RICH_TEXT_EDITOR_CLASS_NAME = "ktc-rich-text-wrapper";


        /// <summary>
        /// HTML helper for rich text inline editor.
        /// </summary>
        /// <param name="instance">The object that provides methods to render HTML fragments.</param>
        /// <param name="propertyName">Name of the widget property which the inline editor edits.</param>
        /// <param name="propertyValue">Current value of the widget property.</param>
        public static void RichTextEditor(this ExtensionPoint<HtmlHelper> instance, string propertyName, string propertyValue)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));
            if (String.IsNullOrWhiteSpace(propertyName))
            {
                throw new ArgumentException(nameof(propertyName));
            }

            var htmlHelper = instance.Target;

            using (htmlHelper.Kentico().BeginInlineEditor(RICH_TEXT_EDITOR_NAME, propertyName))
            {
                var tagBuidler = new TagBuilder("div");
                tagBuidler.AddCssClass(RICH_TEXT_EDITOR_CLASS_NAME);
                tagBuidler.InnerHtml = propertyValue;

                htmlHelper.ViewContext.Writer.Write(tagBuidler.ToString());
            }
        }
    }
}
