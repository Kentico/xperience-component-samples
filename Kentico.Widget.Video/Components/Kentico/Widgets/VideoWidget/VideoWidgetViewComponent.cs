using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;

using Kentico.Components;
using Kentico.PageBuilder.Web.Mvc;

[assembly: RegisterWidget(VideoWidgetViewComponent.IDENTIFIER, typeof(VideoWidgetViewComponent), "{$Kentico.Widget.Video.Name$}", typeof(VideoWidgetProperties), Description = "{$Kentico.Widget.Video.Description$}", IconClass = "icon-brand-youtube")]

namespace Kentico.Components
{
    public class VideoWidgetViewComponent : ViewComponent
    {
        /// <summary>
        /// Widget identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.Widget.Video";


        public ViewViewComponentResult Invoke(VideoWidgetProperties properties)
        {
            var viewModel = VideoHelper.GetVideoModel(properties.VideoUrl);

            return View("~/Components/Kentico/Widgets/VideoWidget/_VideoWidget.cshtml", viewModel);
        }
    }
}
