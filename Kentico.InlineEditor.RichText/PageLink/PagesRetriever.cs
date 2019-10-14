using System;

using CMS.DocumentEngine;
using CMS.DocumentEngine.Internal;
using CMS.SiteProvider;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Retrieves pages for the specified parameters.
    /// </summary>
    internal sealed class PagesRetriever : IPagesRetriever
    {
        private readonly SiteInfo site;

        /// <summary>
        /// Initializes a new instance of the <see cref="PagesRetriever"/> class.
        /// </summary>
        /// <param name="siteName">The site which will be searched.</param>
        /// <exception cref="ArgumentNullException"> if <paramref name="siteName"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException"> if <paramref name="siteName"/> does not carry a name of an existing site.</exception>
        public PagesRetriever(string siteName)
        {
            siteName = siteName ?? throw new ArgumentNullException(nameof(siteName));

            site = SiteInfoProvider.GetSiteInfo(siteName);
            if (site == null)
            {
                throw new ArgumentException($"The given site '{siteName}' does not exists.");
            }
        }


        /// <summary>
        /// Returns a page by its URL.
        /// </summary>
        /// <param name="pageUrl">Page preview URL.</param>
        /// <returns><see cref="TreeNode"/> representing the page, otherwise returns null.</returns>
        /// <exception cref="ArgumentNullException"> if <paramref name="pageUrl"/> is <c>null</c>.</exception>
        public TreeNode GetPage(string pageUrl)
        {
            pageUrl = pageUrl ?? throw new ArgumentNullException(nameof(pageUrl));

            NormalizedAlternativeUrl alternativeUrl = AlternativeUrlHelper.NormalizeAlternativeUrl(pageUrl);

            // Handle the site root
            if (String.IsNullOrEmpty(alternativeUrl.NormalizedUrl))
            {
                return new TreeProvider().SelectSingleNode(site.SiteName, "/", site.DefaultVisitorCulture);
            }

            return AlternativeUrlHelper.GetConflictingPage(new AlternativeUrlInfo()
            {
                AlternativeUrlSiteID = site.SiteID,
                AlternativeUrlUrl = alternativeUrl,
            });
        }
    }
}
