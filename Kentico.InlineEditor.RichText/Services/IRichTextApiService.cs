using System.Web.Mvc;
using System.Web.Routing;

using CMS.DocumentEngine;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// API service of rich text inline editor.
    /// </summary>
    internal interface IRichTextApiService
    {
        /// <summary>
        /// Maps the rich text editor API endpoint route.
        /// </summary>
        /// <param name="routeCollection">Route collection.</param>
        void MapEndpointRoute(RouteCollection routeCollection);


        /// <summary>
        /// Gets the rich text editor API endpoint URL.
        /// </summary>
        /// <param name="urlHelper">URL helper.</param>
        /// <returns>Authenticated URL for the API endpoint.</returns>
        string GetApiEndpointUrl(UrlHelper urlHelper);


        /// <summary>
        /// Returns a page by its URL.
        /// </summary>
        /// <param name="pageUrl">Page preview URL.</param>
        /// <returns><see cref="TreeNode"/> representing the page, otherwise returns null.</returns>
        TreeNode GetPage(string pageUrl);
    }
}
