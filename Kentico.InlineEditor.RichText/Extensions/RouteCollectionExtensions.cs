using System;
using System.Web.Http;
using System.Web.Routing;

using Kentico.Components.Web.Mvc.InlineEditors.Controllers;
using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    public static class RouteCollectionExtensions
    {
        /// <summary>
        /// Maps rich text inline editor routes.
        /// </summary>
        /// <param name="instance">Extension point for route collection.</param>
        public static void MapRichTextInlineEditorRoutes(this ExtensionPoint<RouteCollection> instance)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));

            instance.Target.MapHttpRoute(
                name: RichTextInlineEditorConstants.GET_PAGE_ROUTE_NAME,
                routeTemplate: RichTextInlineEditorConstants.GET_PAGE_ROUTE_TEMPLATE,
                defaults: new { controller = RichTextInlineEditorConstants.CONTROLLER_NAME, action = nameof(RichTextController.GetPage) }
            );
        }
    }
}
