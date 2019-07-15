using Kentico.Content.Web.Mvc;
using Kentico.PageBuilder.Web.Mvc;
using Kentico.Web.Mvc;

namespace Kentico.AspNet.Mvc.SandboxSite
{
    public class ApplicationConfig
    {
        public static void RegisterFeatures(IApplicationBuilder builder)
        {
            // Enable required Kentico features
            builder.UsePreview();
            builder.UsePageBuilder();
            builder.UseResourceSharingWithAdministration();
        }
    }
}