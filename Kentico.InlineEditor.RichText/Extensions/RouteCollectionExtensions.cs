using System;
using System.Web.Routing;

using CMS.Core;

using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    public static class RouteCollectionExtensions
    {
        /// <summary>
        /// Maps rich text editor routes.
        /// </summary>
        /// <param name="instance">Extension point for route collection.</param>
        public static void MapRichTextEditorRoutes(this ExtensionPoint<RouteCollection> instance)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));

            Service.Resolve<IRichTextApiService>().MapEndpointRoute(instance.Target);
        }
    }
}
