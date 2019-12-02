using System.Net;
using System.Web.Mvc;

using CMS.Base;
using CMS.Core;
using CMS.EventLog;
using CMS.SiteProvider;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.Components.Web.Mvc.Widgets.Controllers;
using Kentico.Components.Web.Mvc.Widgets.Models;
using Kentico.PageBuilder.Web.Mvc;

[assembly: RegisterWidget(KenticoRichTextWidgetController.IDENTIFIER, typeof(KenticoRichTextWidgetController), "{$Kentico.Widget.RichText.Name$}", Description = "{$Kentico.Widget.RichText.Description$}", IconClass = "icon-l-text")]

namespace Kentico.Components.Web.Mvc.Widgets.Controllers
{
    /// <summary>
    /// Rich text widget controller.
    /// </summary>
    public class KenticoRichTextWidgetController : WidgetController<RichTextWidgetProperties>
    {
        private readonly RichTextWidgetOptions options;
        private readonly IRichTextGetLinkMetadataActionExecutor getLinkMetadataAction;
        private readonly IEventLogService eventLogService;

        /// <summary>
        /// The rich text widget identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.Widget.RichText";


        /// <summary>
        /// Constructor which accepts options for rich text editor customization.
        /// </summary>
        /// <param name="options">Rich text widget options.</param>
        protected KenticoRichTextWidgetController(RichTextWidgetOptions options) : this()
        {
            this.options = options;
        }


        public KenticoRichTextWidgetController()
            : this(new RichTextGetLinkMetadataActionExecutor(new PagesRetriever(SiteContext.CurrentSiteName), SystemContext.ApplicationPath),
                  Service.Resolve<IEventLogService>())
        {
            options = new RichTextWidgetOptions();
        }


        internal KenticoRichTextWidgetController(IRichTextGetLinkMetadataActionExecutor getLinkMetadataAction, IEventLogService eventLogService)
        {
            this.getLinkMetadataAction = getLinkMetadataAction;
            this.eventLogService = eventLogService;
        }


        // GET: RichTextWidget
        public ActionResult Index()
        {
            var properties = GetProperties();
            var viewModel = new RichTextWidgetViewModel
            {
                ContentPropertyName = nameof(properties.Content),
                Content = properties.Content,
                ConfigurationName = options.ConfigurationName,
            };

            return PartialView("~/Views/Shared/Kentico/Widgets/_RichTextWidget.cshtml", viewModel);
        }


        /// <summary>
        /// Serves the link meta data for the given URL.
        /// </summary>
        /// <param name="linkUrl">The page URL.</param>
        [HttpGet]
        public ActionResult GetLinkMetadata(string linkUrl)
        {
            var actionResult = getLinkMetadataAction.ProcessAction(linkUrl);

            if (actionResult.StatusCode == HttpStatusCode.OK)
            {
                return new JsonCamelCaseResult(actionResult.LinkModel, JsonRequestBehavior.AllowGet);
            }

            eventLogService.LogEvent(EventType.ERROR, nameof(KenticoRichTextWidgetController), nameof(GetLinkMetadata), actionResult.StatusCodeMessage);

            return new HttpStatusCodeResult(actionResult.StatusCode);
        }
    }
}
