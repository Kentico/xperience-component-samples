using System.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Provides an interface for retrieving rich text endpoint URLs.
    /// </summary>
    internal interface IRichTextUrlRetriever
    {
        /// <summary>
        /// Gets the "GetPage" endpoint URL.
        /// </summary>
        /// <param name="urlHelper">The 'UrlHelper'instance of the current request.</param>
        string GetPageEndpointUrl(UrlHelper urlHelper);
    }
}
