using System.Net;
using System.Web.Mvc;

using CMS.Core;
using CMS.EventLog;
using CMS.SiteProvider;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Components.Web.Mvc.Widgets.Controllers;
using Kentico.Components.Web.Mvc.Widgets.Models;
using Kentico.PageBuilder.Web.Mvc;

[assembly: RegisterWidget(RichTextWidgetController.IDENTIFIER, typeof(RichTextWidgetController), "{$Kentico.Widget.RichText.Name$}", Description = "{$Kentico.Widget.RichText.Description$}", IconClass = "icon-l-text")]

namespace Kentico.Components.Web.Mvc.Widgets.Controllers
{
    /// <summary>
    /// Rich text widget controller.
    /// </summary>
    public class RichTextWidgetController : WidgetController<RichTextWidgetProperties>
    {
        private readonly IRichTextGetPageActionExecutor getPageAction;
        private readonly IEventLogService eventLogService;

        /// <summary>
        /// The rich text widget identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.Widget.RichText";


        public RichTextWidgetController()
            : this(new RichTextGetPageActionExecutor(new PagesRetriever(SiteContext.CurrentSiteName)),
                  Service.Resolve<IEventLogService>())
        {
        }


        internal RichTextWidgetController(IRichTextGetPageActionExecutor getPageAction, IEventLogService eventLogService)
        {
            this.getPageAction = getPageAction;
            this.eventLogService = eventLogService;
        }


        // GET: RichTextWidget
        public ActionResult Index()
        {
            var properties = GetProperties();
            var viewModel = new RichTextWidgetViewModel
            {
                ContentPropertyName = nameof(properties.Content),
                Content = properties.Content
            };

            return PartialView("~/Views/Shared/Kentico/Widgets/_RichTextWidget.cshtml", viewModel);
        }


        /// <summary>
        /// Serves the page meta data for the given page URL.
        /// </summary>
        /// <param name="pageUrl">The page URL.</param>
        [HttpGet]
        public ActionResult GetPage(string pageUrl)
        {
            var actionResult = getPageAction.ProcessAction(pageUrl);

            if (actionResult.StatusCode == HttpStatusCode.OK)
            {
                return new JsonCamelCaseResult(actionResult.Page, JsonRequestBehavior.AllowGet);
            }

            eventLogService.LogEvent(EventType.ERROR, nameof(RichTextWidgetController), nameof(GetPage), actionResult.StatusCodeMessage);

            return new HttpStatusCodeResult(actionResult.StatusCode);
        }
    }
}
