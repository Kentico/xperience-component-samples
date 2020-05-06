using System;
using System.Web.Http;
using System.Web.Routing;

using Kentico.Components.Web.Mvc.Selectors.Controllers;
using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.Selectors
{
    public static class RouteCollectionExtensions
    {
        /// <summary>
        /// Maps object selector routes.
        /// </summary>
        /// <param name="instance">Extension point for route collection.</param>
        public static void MapObjectSelectorRoutes(this ExtensionPoint<RouteCollection> instance)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));

            instance.Target.MapHttpRoute(
                name: ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME,
                routeTemplate: ObjectSelectorConstants.GET_OBJECTS_ROUTE,
                defaults: new { controller = ObjectSelectorConstants.CONTROLLER_NAME, action = nameof(KenticoObjectSelectorController.GetObjects) }
            );
        }
    }
}
