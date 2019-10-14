using System;

using CMS.DocumentEngine;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Provides an interface for retrieving pages.
    /// </summary>
    internal interface IPagesRetriever
    {
        /// <summary>
        /// Returns a page by its URL.
        /// </summary>
        /// <param name="pageUrlPath">The page preview URL path.</param>
        /// <returns><see cref="TreeNode"/> representing the page, otherwise returns null.</returns>
        /// <exception cref="ArgumentNullException"> if <paramref name="pageUrl"/> is <c>null</c>.</exception>
        TreeNode GetPage(string pageUrlPath);
    }
}
