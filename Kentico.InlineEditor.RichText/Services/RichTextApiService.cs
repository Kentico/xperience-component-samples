using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

using CMS;
using CMS.DocumentEngine;
using CMS.DocumentEngine.Internal;
using CMS.SiteProvider;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Content.Web.Mvc;
using Kentico.Web.Mvc;

[assembly: RegisterImplementation(typeof(IRichTextApiService), typeof(RichTextApiService))]

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// API service of rich text inline editor.
    /// </summary>
    internal sealed class RichTextApiService : IRichTextApiService
    {
        private const string RICH_TEXT_API_ENDPOINT = "api/RichText";


        /// <summary>
        /// Maps the rich text editor API endpoint route.
        /// </summary>
        /// <param name="routeCollection">Route collection.</param>
        public void MapEndpointRoute(RouteCollection routeCollection)
        {
            routeCollection.MapHttpRoute(
                name: "RichTextApi",
                routeTemplate: RICH_TEXT_API_ENDPOINT,
                defaults: new { controller = "RichText", action = "GetPage" }
            );
        }


        /// <summary>
        /// Gets the rich text editor API endpoint URL.
        /// </summary>
        /// <param name="urlHelper">URL helper.</param>
        /// <returns>Authenticated URL for the API endpoint.</returns>
        public string GetApiEndpointUrl(UrlHelper urlHelper)
        {
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));

            return urlHelper.Kentico().AuthenticateUrl($"~/{RICH_TEXT_API_ENDPOINT}").ToString();
        }


        /// <summary>
        /// Returns a page by its URL.
        /// </summary>
        /// <param name="pageUrl">Page preview URL.</param>
        /// <returns><see cref="TreeNode"/> representing the page, otherwise returns null.</returns>
        public TreeNode GetPage(string pageUrl)
        {
            pageUrl = pageUrl ?? throw new ArgumentNullException(nameof(pageUrl));

            return AlternativeUrlHelper.GetConflictingPage(new AlternativeUrlInfo()
            {
                AlternativeUrlSiteID = SiteContext.CurrentSiteID,
                AlternativeUrlUrl = AlternativeUrlHelper.NormalizeAlternativeUrl(pageUrl),
            });
        }
    }
}
