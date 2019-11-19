using System;
using System.Web.Mvc;

using CMS;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Components.Web.Mvc.Widgets.Controllers;

// Register the implementation of the IRichTextUrlRetriever that can serve the page link data via the rich text widget controller.
[assembly: RegisterImplementation(typeof(IRichTextUrlRetriever), typeof(RichTextWidgetUrlRetriever))]

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Retrieves endpoints URLs used by the rich text inline editor.
    /// </summary>
    /// <remarks>
    /// This implementation does not require a manually registered route, because the rich text widget has its route registered by the system.
    /// This route can serve all widget actions (it uses the {action} placeholder in the route template).
    /// </remarks>
    internal sealed class RichTextWidgetUrlRetriever : IRichTextUrlRetriever
    {
        /// <summary>
        /// Gets the "GetLinkMetadata" endpoint URL.
        /// </summary>
        /// <param name="urlHelper">The 'UrlHelper'instance of the current request.</param>
        public string GetLinkMetadataEndpointUrl(UrlHelper urlHelper)
        {
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));

            return urlHelper.Action(nameof(KenticoRichTextWidgetController.GetLinkMetadata), "KenticoRichTextWidget");
        }
    }
}
