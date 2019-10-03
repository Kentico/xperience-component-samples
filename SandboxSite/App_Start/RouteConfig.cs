using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Web.Mvc;

namespace Kentico.AspNet.Mvc.SandboxSite
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.Kentico().MapRichTextEditorRoutes();
            
            // Maps routes to Kentico HTTP handlers and features enabled in ApplicationConfig.cs
            // Always map the Kentico routes before adding other routes. Issues may occur if Kentico URLs are matched by a general route, for example images might not be displayed on pages
            routes.Kentico().MapRoutes();

            routes.MapRoute(
                name: "Page",
                url: "Page/{nodeAlias}",
                defaults: new { controller = "Page", action = "Index" }
            );

            routes.MapRoute(
                name: "Root",
                url: "",
                defaults: new { controller = "Page", action = "Index", nodeAlias = "Home" }
            );
        }
    }
}
