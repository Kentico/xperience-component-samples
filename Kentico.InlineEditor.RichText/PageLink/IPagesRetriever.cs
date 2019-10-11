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
        /// <param name="pageUrlPath">Page preview URL path.</param>
        /// <returns><see cref="TreeNode"/> representing the page, otherwise returns null.</returns>
        TreeNode GetPage(string pageUrlPath);
    }
}
