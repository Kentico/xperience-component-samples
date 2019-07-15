using System.ComponentModel.DataAnnotations;

using Kentico.Forms.Web.Mvc;
using Kentico.PageBuilder.Web.Mvc;

namespace Kentico.Widget.Video.Models
{
    /// <summary>
    /// Video widget properties.
    /// </summary>
    public class VideoWidgetProperties : IWidgetProperties
    {
        /// <summary>
        /// Video URL.
        /// </summary>
        [Required]
        [EditingComponent(VideoUrlComponent.IDENTIFIER, Label = "{$Kentico.Widget.Video.Label$}", Order = 1)]
        [RegularExpression(@"^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+", ErrorMessage = "Video URL is not valid.")]
        public string VideoUrl { get; set; }
    }
}