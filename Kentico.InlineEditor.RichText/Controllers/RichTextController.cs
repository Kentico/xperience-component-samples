using System.Net;
using System.Web.Http;

using Kentico.Components.Web.Mvc.InlineEditors.Internal;

namespace Kentico.Components.Web.Mvc.InlineEditors.Controllers
{
    public class RichTextController : ApiController
    {
        public const string COMPONENT_IDENTIFIER = "Kentico.InlineEditor.RichText";
        private readonly RichTextActionsHandler richTextActionsHelper = new RichTextActionsHandler();


        [HttpGet]
        public IHttpActionResult GetPage(string pageUrl)
        {
            object responseData = null;
            HttpStatusCode statusCode = richTextActionsHelper.HandleGetPageAction(pageUrl, ref responseData);
            
            switch (statusCode)
            {
                case HttpStatusCode.OK:
                    return Ok<dynamic>(responseData);

                case HttpStatusCode.BadRequest:
                    return BadRequest("Invalid page URL.");

                default:
                    return StatusCode(statusCode);
            }
        }
    }
}
