using System;
using System.Threading;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

using CMS;
using CMS.DocumentEngine;
using CMS.DocumentEngine.Internal;
using CMS.SiteProvider;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Components.Web.Mvc.InlineEditors.Controllers;
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
        private readonly string richTextApiEndpoint = $"KenticoComponent/{RichTextController.COMPONENT_IDENTIFIER}/GetPage";
        private readonly string richTextApiEndpointFallback = $"Kentico.PageBuilder/Widgets/{Thread.CurrentThread.CurrentCulture.Name}/Kentico.Widget.RichText/GetPage";


        public string CurrentCulture => Thread.CurrentThread.CurrentCulture.Name;


        /// <summary>
        /// Maps the rich text editor API endpoint route.
        /// </summary>
        /// <param name="routeCollection">Route collection.</param>
        public void MapEndpointRoute(RouteCollection routeCollection)
        {
            routeCollection.MapHttpRoute(
                name: RichTextController.COMPONENT_IDENTIFIER,
                routeTemplate: richTextApiEndpoint,
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

            var richTextEditorRoute = urlHelper.RouteCollection[RichTextController.COMPONENT_IDENTIFIER];
            var endpointUrl = richTextEditorRoute == null ? richTextApiEndpointFallback : richTextApiEndpoint;

            return urlHelper.Kentico().AuthenticateUrl($"~/{endpointUrl}").ToString();
        }


        /// <summary>
        /// Returns a page by its URL.
        /// </summary>
        /// <param name="pageUrl">Page preview URL.</param>
        /// <returns><see cref="TreeNode"/> representing the page, otherwise returns null.</returns>
        public TreeNode GetPage(string pageUrl)
        {
            pageUrl = pageUrl ?? throw new ArgumentNullException(nameof(pageUrl));

            NormalizedAlternativeUrl alternativeUrl = AlternativeUrlHelper.NormalizeAlternativeUrl(pageUrl);
            if (String.IsNullOrEmpty(alternativeUrl.NormalizedUrl))
            {
                return new TreeProvider().SelectSingleNode(SiteContext.CurrentSiteName, "/", CurrentCulture);
            }

            return AlternativeUrlHelper.GetConflictingPage(new AlternativeUrlInfo()
            {
                AlternativeUrlSiteID = SiteContext.CurrentSiteID,
                AlternativeUrlUrl = alternativeUrl,
            });
        }
    }
}
