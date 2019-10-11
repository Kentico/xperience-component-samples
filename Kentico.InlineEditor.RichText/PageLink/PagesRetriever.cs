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
