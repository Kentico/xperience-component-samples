using System.Net;

namespace Kentico.Components.Web.Mvc.InlineEditors.Internal
{
    public interface IRichTextActionsHandler
    {
        HttpStatusCode HandleGetPageAction(string pagePreviewUrl, ref object responseData);
    }
}
