using CMS.DataEngine;
using Kentico.Forms.Web.Mvc;

namespace Kentico.Widget.Video.Models
{
    public class VideoUrlProperties : FormComponentProperties<string>
    {
        [DefaultValueEditingComponent(VideoUrlComponent.IDENTIFIER)]
        public override string DefaultValue { get; set; }


        public VideoUrlProperties()
           : base(FieldDataType.Text, 500)
        {
        }
    }
}
