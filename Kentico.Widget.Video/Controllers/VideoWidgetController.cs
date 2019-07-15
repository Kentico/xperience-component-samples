using System.Web.Mvc;

using Kentico.PageBuilder.Web.Mvc;

using Kentico.Widget.Video.Controllers;
using Kentico.Widget.Video.Models;

[assembly: RegisterWidget("Kentico.Widget.Video", typeof(VideoWidgetController), "{$Kentico.Widget.Video.Name$}", Description = "{$Kentico.Widget.Video.Description$}", IconClass = "icon-w-image-gallery")]

namespace Kentico.Widget.Video.Controllers
{
    /// <summary>
    /// Controller for image widgets.
    /// </summary>
    public class VideoWidgetController : WidgetController<VideoWidgetProperties>
    {
        // GET: ImageWidget
        public ActionResult Index()
        {
            var properties = GetProperties();
            var viewModel = new VideoWidgetViewModel
            {
                VideoUrl = properties.VideoUrl,
            };

            return View("~/Views/Shared/Kentico/Widgets/_VideoWidget.cshtml", viewModel);
        }
    }
}