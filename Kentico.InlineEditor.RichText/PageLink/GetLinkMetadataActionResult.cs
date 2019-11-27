using System.Net;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a result model of the GetLinkMetadata action that can be used either in MVC controllers or WebAPI controllers.
    /// </summary>
    internal class GetLinkMetadataActionResult
    {
        /// <summary>
        /// Gets the link model with meta data.
        /// </summary>
        public LinkModel LinkModel { get; }

        /// <summary>
        /// Gets the HTTP status code that action should return.
        /// </summary>
        public HttpStatusCode StatusCode { get; }

        /// <summary>
        /// Gets the HTTP status code message in case something went wrong.
        /// </summary>
        public string StatusCodeMessage { get; }


        public GetLinkMetadataActionResult(HttpStatusCode statusCode, LinkModel linkModel = null, string statusCodeMessage = null)
        {
            LinkModel = linkModel;
            StatusCode = statusCode;
            StatusCodeMessage = statusCodeMessage;
        }
    }
}
