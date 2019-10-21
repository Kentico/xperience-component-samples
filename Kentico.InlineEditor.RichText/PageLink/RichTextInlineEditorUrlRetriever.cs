using System;
using System.Web.Mvc;
using System.Web.Routing;

using CMS;
using CMS.Core;

using Kentico.Components.Web.Mvc.InlineEditors;

// Register a default implementation of the IRichTextUrlRetriever that can be overridden if another route is able to serve the page link data.
[assembly: RegisterImplementation(typeof(IRichTextUrlRetriever), typeof(RichTextInlineEditorUrlRetriever), Priority = RegistrationPriority.SystemDefault)]

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Retrieves endpoints URLs used by the rich text inline editor.
    /// </summary>
    /// <remarks>
    /// This implementation requires to have a manually registered route that will process the "GetPage" request,
    /// because inline editors are not able to register their routes automatically.
    /// </remarks>
    internal sealed class RichTextInlineEditorUrlRetriever : IRichTextUrlRetriever
    {
        /// <summary>
        /// Gets the "GetPage" endpoint URL.
        /// </summary>
        /// <param name="urlHelper">The 'UrlHelper'instance of the current request.</param>
        public string GetPageEndpointUrl(UrlHelper urlHelper)
        {
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));

            return urlHelper.HttpRouteUrl(RichTextInlineEditorConstants.GET_PAGE_ROUTE_NAME, new RouteValueDictionary());
        }
    }
}
