using Kentico.Components.Web.Mvc.InlineEditors.Controllers;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Rich text inline editor constants.
    /// </summary>
    internal static class RichTextInlineEditorConstants
    {
        /// <summary>
        /// The rich text inline editor internal identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.InlineEditor.RichText";

        /// <summary>
        /// The license settings key name.
        /// </summary>
        public const string LICENSE_SETTINGS_KEY_NAME = "CMSRichTextEditorLicense";

        /// <summary>
        /// The controller name that serves rich text API calls.
        /// </summary>
        public const string CONTROLLER_NAME = "RichText";

        /// <summary>
        /// The route name that serves link meta data.
        /// </summary>
        public const string GET_LINK_METADATA_ROUTE_NAME = "Kentico.InlineEditor.RichText.GetLinkMetadata";

        /// <summary>
        /// The route template name that serves page meta data.
        /// </summary>
        public const string GET_PAGE_ROUTE_TEMPLATE = "KenticoComponent/Kentico.InlineEditor.RichText/" + nameof(RichTextController.GetLinkMetadata);
    }
}
