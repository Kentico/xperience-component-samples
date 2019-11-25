namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a class that can run the "GetLinkMetadata" action and return a result model that can be used either in MVC controllers or WebAPI controllers.
    /// </summary>
    internal interface IRichTextGetLinkMetadataActionExecutor
    {
        /// <summary>
        /// Processes the GetLinkMetadata action.
        /// </summary>
        /// <param name="linkUrl">The link URL.</param>
        GetLinkMetadataActionResult ProcessAction(string linkUrl);
    }
}