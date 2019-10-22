using System;
using System.Web.Mvc;

using CMS;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Content.Web.Mvc;
using Kentico.Web.Mvc;

[assembly: RegisterImplementation(typeof(IPreviewPathDecorator), typeof(PreviewPathDecorator))]

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Decorates path with a virtual context prefix to include preview context data.
    /// </summary>
    internal class PreviewPathDecorator : IPreviewPathDecorator
    {
        /// <summary>
        /// Decorates given path.
        /// </summary>
        /// <param name="path">Path to decorate.</param>
        /// <param name="urlHelper">The 'UrlHelper'instance of the current request.</param>
        public string Decorate(string path, UrlHelper urlHelper)
        {
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));

            return urlHelper.Kentico().AuthenticateUrl(path).ToString();
        }
    }
}
