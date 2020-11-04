using Microsoft.AspNetCore.Mvc;

using Kentico.PageBuilder.Web.Mvc;
using Kentico.Widget.Video;

[assembly: RegisterWidget(VideoWidgetViewComponent.IDENTIFIER, typeof(VideoWidgetViewComponent), "{$Kentico.Widget.Video.Name$}", typeof(VideoWidgetProperties), Description = "{$Kentico.Widget.Video.Description$}", IconClass = "icon-brand-youtube")]

namespace Kentico.Widget.Video
{
    public class VideoWidgetViewComponent : ViewComponent
    {
        /// <summary>
        /// Widget identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.Widget.Video";


        public IViewComponentResult Invoke(ComponentViewModel<VideoWidgetProperties> componentViewModel)
        {
            var viewModel = VideoHelper.GetVideoModel(componentViewModel.Properties.VideoUrl);

            return View("~/KenticoComponents/VideoWidget/_VideoWidget.cshtml", viewModel);
        }
    }
}
