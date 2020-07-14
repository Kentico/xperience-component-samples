using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Forms.Web.Mvc;

[assembly: RegisterFormComponent(RichText.IDENTIFIER, typeof(RichText), "{$Kentico.FormComponent.RichText.Name$}", ViewName = "~/Views/Shared/Kentico/FormComponents/_RichText.cshtml", IsAvailableInFormBuilderEditor = false)]

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents a rich text form component.
    /// </summary>
    public class RichText : FormComponent<RichTextProperties, string>
    {
        /// <summary>
        /// Represents the <see cref="RichText"/> identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.RichText";


        /// <summary>
        /// Represents the HTML content.
        /// </summary>
        [BindableProperty]
        public string Value { get; set; }


        /// <summary>
        /// Gets the value of the form component.
        /// </summary>
        public override string GetValue()
        {
            return Value;
        }


        /// <summary>
        /// Sets the value of the form component.
        /// </summary>
        /// <param name="value"></param>
        public override void SetValue(string value)
        {
            Value = value;
        }
    }
}
