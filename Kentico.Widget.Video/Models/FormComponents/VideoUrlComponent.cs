using Kentico.Forms.Web.Mvc;
using Kentico.Widget.Video.Models;

[assembly: RegisterFormComponent(VideoUrlComponent.IDENTIFIER, typeof(VideoUrlComponent), "{$Kentico.FormComponent.VideoUrl.Name$}", Description = "{$Kentic.FormComponent.VideoUrl.Description$}", IconClass = "icon-l-text", IsAvailableInFormBuilderEditor = false, ViewName = "~/Views/Shared/Kentico/FormComponents/_VideoUrl.cshtml")]

namespace Kentico.Widget.Video.Models
{
    public class VideoUrlComponent : FormComponent<VideoUrlProperties, string>
    {
        /// <summary>
        /// Represents the <see cref="VideoUrlComponent"/> identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.FormComponent.VideoUrl";


        /// <summary>
        /// Represents the input value in the resulting HTML.
        /// </summary>
        [BindableProperty]
        public string Url { get; set; }


        public override string GetValue()
        {
            return Url;
        }


        public override void SetValue(string value)
        {
            Url = value;
        }
    }
}
