namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a class that can run the "GetPage" action and return a result model that can be used either in MVC controllers or WebAPI controllers.
    /// </summary>
    internal interface IRichTextGetPageActionExecutor
    {
        /// <summary>
        /// Processes the GetPage action.
        /// </summary>
        /// <param name="pagePreviewUrl">The page URL decorated with the preview URL prefix (virtual context).</param>
        GetPageActionResult ProcessAction(string pagePreviewUrl);
    }
}