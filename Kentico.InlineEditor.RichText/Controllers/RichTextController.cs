using System.Net;
using System.Web.Http;

using CMS.Core;
using CMS.EventLog;
using CMS.Membership;
using CMS.SiteProvider;

namespace Kentico.Components.Web.Mvc.InlineEditors.Controllers
{
    /// <summary>
    /// The rich text inline editor API controller.
    /// </summary>
    [UseCamelCasePropertyNamesContractResolver]
    public class RichTextController : ApiController
    {
        private readonly IRichTextGetPageActionExecutor richTextGetPageAction;
        private readonly IEventLogService eventLogService;


        public RichTextController()
            : this(new RichTextGetPageActionExecutor(new PagesRetriever(SiteContext.CurrentSiteName)),
                  Service.Resolve<IEventLogService>())
        {
        }


        internal RichTextController(IRichTextGetPageActionExecutor richTextGetPageAction, IEventLogService eventLogService)
        {
            this.richTextGetPageAction = richTextGetPageAction;
            this.eventLogService = eventLogService;
        }


        /// <summary>
        /// Serves the page meta data for the given page URL.
        /// </summary>
        /// <param name="pageUrl">The page URL.</param>
        public IHttpActionResult GetPage(string pageUrl)
        {
            var actionResult = richTextGetPageAction.ProcessAction(pageUrl);
            if (actionResult.StatusCode == HttpStatusCode.OK)
            {
                return Ok(actionResult.Page);
            }

            eventLogService.LogEvent(EventType.ERROR, nameof(RichTextController), nameof(GetPage), actionResult.StatusCodeMessage);

            return StatusCode(actionResult.StatusCode);
        }
    }
}
