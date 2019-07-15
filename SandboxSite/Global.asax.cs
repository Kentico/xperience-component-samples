using System.Web.Routing;

using Kentico.Web.Mvc;

namespace Kentico.AspNet.Mvc.SandboxSite
{
    public class SandboxSiteMvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Enables and configures selected Kentico ASP.NET MVC integration features
            ApplicationConfig.RegisterFeatures(ApplicationBuilder.Current);

            // Registers routes including system routes for enabled features
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
