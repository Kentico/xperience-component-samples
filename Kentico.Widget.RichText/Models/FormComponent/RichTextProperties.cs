using CMS.DataEngine;

using Kentico.Forms.Web.Mvc;

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents properties of the <see cref="RichText"/>.
    /// </summary>
    public class RichTextProperties : FormComponentProperties<string>
    {
        /// <summary>
        /// Default value.
        /// </summary>
        public override string DefaultValue { get; set; }


        /// <summary>
        /// Creates an instance of the <see cref="ObjectSelectorProperties"/> class.
        /// </summary>
        /// <remarks>
        /// The constructor initializes the base class to data type <see cref="FieldDataType.LongText"/>.
        /// </remarks>
        public RichTextProperties()
            : base(FieldDataType.LongText)
        {
        }
    }
}
