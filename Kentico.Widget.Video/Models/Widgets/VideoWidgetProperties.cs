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
        [EditingComponent(TextInputComponent.IDENTIFIER, Label = "{$Kentico.Widget.Video.Label$}", Order = 1)]
        [EditingComponentProperty(nameof(TextInputProperties.Placeholder), "{$Kentico.Widget.Video.VideoUrl.Placeholder$}")]
        [RegularExpression(@"^(http(s)?:\/\/)?((w){3}.)?(m.)?youtu(be|.be)?(\.com)?\/.+", ErrorMessage = "Kentico.Widget.Video.VideoUrl.ValidationMessage")]
        public string VideoUrl { get; set; }
    }
}