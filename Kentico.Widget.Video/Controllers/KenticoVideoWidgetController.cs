using System.Web.Mvc;

using Kentico.Components.Web.Mvc.Widgets.Controllers;
using Kentico.Components.Web.Mvc.Widgets.Helpers;
using Kentico.Components.Web.Mvc.Widgets.Models;
using Kentico.PageBuilder.Web.Mvc;

[assembly: RegisterWidget("Kentico.Widget.Video", typeof(KenticoVideoWidgetController), "{$Kentico.Widget.Video.Name$}", Description = "{$Kentico.Widget.Video.Description$}", IconClass = "icon-brand-youtube")]

namespace Kentico.Components.Web.Mvc.Widgets.Controllers
{
    /// <summary>
    /// Controller for video widgets.
    /// </summary>
    public class KenticoVideoWidgetController : WidgetController<VideoWidgetProperties>
    {
        // GET: VideoWidget
        public ActionResult Index()
        {
            var properties = GetProperties();
            var viewModel = VideoHelper.GetVideoModel(properties.VideoUrl);

            return PartialView("~/Views/Shared/Kentico/Widgets/_VideoWidget.cshtml", viewModel);
        }
    }
}