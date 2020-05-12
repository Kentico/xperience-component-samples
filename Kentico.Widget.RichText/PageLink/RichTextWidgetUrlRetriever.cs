using System;
using System.Threading;
using System.Web.Mvc;
using System.Web.Routing;

using CMS;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Components.Web.Mvc.Widgets;

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
        public const string CULTURE_ROUTE_KEY = "cultureCode";
        public const string TYPE_IDENTIFIER_ROUTE_KEY = "typeIdentifier";


        /// <summary>
        /// Gets the "GetLinkMetadata" endpoint URL.
        /// </summary>
        /// <param name="urlHelper">The 'UrlHelper'instance of the current request.</param>
        public string GetLinkMetadataEndpointUrl(UrlHelper urlHelper)
        {
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));

            return urlHelper.Action(nameof(KenticoRichTextWidgetController.GetLinkMetadata), GetWidgetRouteValues(KenticoRichTextWidgetController.IDENTIFIER));
        }


        /// <summary>
        /// Gets the route values of the system-defined route that serves all widget actions (PageBuilderRoutes.WIDGETS_ROUTE)
        /// </summary>
        private RouteValueDictionary GetWidgetRouteValues(string widgetIdentifier)
        {
            return new RouteValueDictionary
            {
                { CULTURE_ROUTE_KEY, Thread.CurrentThread.CurrentCulture.Name },
                { TYPE_IDENTIFIER_ROUTE_KEY, widgetIdentifier },
            };
        }
    }
}
