using System.ComponentModel.DataAnnotations;

using Kentico.Forms.Web.Mvc;
using Kentico.PageBuilder.Web.Mvc;
using Kentico.Widget.Video.Helpers;

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
        [EditingComponent(TextInputComponent.IDENTIFIER, Label = "{$Kentico.Widget.Video.Label$}", Order = 1)]
        [EditingComponentProperty(nameof(TextInputProperties.Placeholder), "{$Kentico.Widget.Video.VideoUrl.Placeholder$}")]
        [RegularExpression(YoutubeVideoHelper.REGEX_YOUTUBE_URL, ErrorMessage = "Kentico.Widget.Video.VideoUrl.InvalidFormatMessage")]
        public string VideoUrl { get; set; }
    }
}