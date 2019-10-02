using System;
using System.Web.Routing;

using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    public static class RouteCollectionExtensions
    {
        public static void MapRichTextRoutes(this ExtensionPoint<RouteCollection> instance)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));

            new RichTextApiService().MapEndpointRoute(instance.Target);
        }
    }
}
