using System.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Provides an interface for decorating path with additional preview information using the virtual context feature.
    /// </summary>
    internal interface IPreviewPathDecorator
    {
        /// <summary>
        /// Decorates given path.
        /// </summary>
        /// <param name="path">Path to decorate</param>
        string Decorate(string path, UrlHelper urlHelper);
    }
}
