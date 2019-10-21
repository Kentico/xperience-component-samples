using System.Net;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a result model of the GetPage action that can be used either in MVC controllers or WebAPI controllers.
    /// </summary>
    internal class GetPageActionResult
    {
        /// <summary>
        /// Gets the page model.
        /// </summary>
        public PageLinkModel Page { get; }

        /// <summary>
        /// Gets the HTTP status code that action should return.
        /// </summary>
        public HttpStatusCode StatusCode { get; }

        /// <summary>
        /// Gets the HTTP status code message in case something went wrong.
        /// </summary>
        public string StatusCodeMessage { get; }


        public GetPageActionResult(HttpStatusCode statusCode, PageLinkModel page = null, string statusCodeMessage = null)
        {
            Page = page;
            StatusCode = statusCode;
            StatusCodeMessage = statusCodeMessage;
        }
    }
}
