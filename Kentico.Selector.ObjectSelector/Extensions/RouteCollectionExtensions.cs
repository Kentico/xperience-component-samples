using System;

using Kentico.Components.Web.Mvc.Selectors.Controllers;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Kentico.Components.Web.Mvc.Selectors
{
    public static class RouteCollectionExtensions
    {
        /// <summary>
        /// Maps object selector routes.
        /// </summary>
        /// <param name="instance">Extension point for route collection.</param>
        public static void MapObjectSelectorRoutes(this IEndpointRouteBuilder instance)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));

            instance.MapControllerRoute(
                name: ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME,
                pattern: ObjectSelectorConstants.GET_OBJECTS_ROUTE,
                defaults: new { controller = ObjectSelectorConstants.CONTROLLER_NAME, action = nameof(KenticoObjectSelectorController.GetObjects) }
            );
        }
    }
}
