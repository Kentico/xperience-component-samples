using System.Net;
using System.Web.Http;

using CMS.Base;
using CMS.Core;
using CMS.EventLog;
using CMS.SiteProvider;

namespace Kentico.Components.Web.Mvc.InlineEditors.Controllers
{
    /// <summary>
    /// The rich text inline editor API controller.
    /// </summary>
    [UseCamelCasePropertyNamesContractResolver]
    public class KenticoRichTextController : ApiController
    {
        private readonly IRichTextGetLinkMetadataActionExecutor richTextGetLinkMetadataAction;
        private readonly IEventLogService eventLogService;


        public KenticoRichTextController()
            : this(new RichTextGetLinkMetadataActionExecutor(new PagesRetriever(SiteContext.CurrentSiteName), SystemContext.ApplicationPath),
                  Service.Resolve<IEventLogService>())
        {
        }


        internal KenticoRichTextController(IRichTextGetLinkMetadataActionExecutor richTextGetLinkMetadataAction, IEventLogService eventLogService)
        {
            this.richTextGetLinkMetadataAction = richTextGetLinkMetadataAction;
            this.eventLogService = eventLogService;
        }


        /// <summary>
        /// Serves the link meta data for the given URL.
        /// </summary>
        /// <param name="linkUrl">The link URL.</param>
        public IHttpActionResult GetLinkMetadata(string linkUrl)
        {
            var actionResult = richTextGetLinkMetadataAction.ProcessAction(linkUrl);
            if (actionResult.StatusCode == HttpStatusCode.OK)
            {
                return Ok(actionResult.LinkModel);
            }

            eventLogService.LogEvent(EventType.ERROR, nameof(KenticoRichTextController), nameof(GetLinkMetadata), actionResult.StatusCodeMessage);

            return StatusCode(actionResult.StatusCode);
        }
    }
}
