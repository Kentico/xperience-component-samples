using System.Net;
using System.Web.Mvc;

using Kentico.Components.Web.Mvc.InlineEditors.Internal;
using Kentico.Components.Web.Mvc.Widgets.Controllers;
using Kentico.Components.Web.Mvc.Widgets.Models;
using Kentico.PageBuilder.Web.Mvc;

[assembly: RegisterWidget("Kentico.Widget.RichText", typeof(RichTextWidgetController), "{$Kentico.Widget.RichText.Name$}", Description = "{$Kentico.Widget.RichText.Description$}", IconClass = "icon-l-text")]

namespace Kentico.Components.Web.Mvc.Widgets.Controllers
{
    /// <summary>
    /// Rich text widget controller.
    /// </summary>
    public class RichTextWidgetController : WidgetController<RichTextWidgetProperties>
    {
        private readonly RichTextActionsHandler richTextActionsHelper = new RichTextActionsHandler();


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


        public ActionResult GetPage(string pageUrl)
        {
            object responseData = null;
            HttpStatusCode statusCode = richTextActionsHelper.HandleGetPageAction(pageUrl, ref responseData);

            switch (statusCode)
            {
                case HttpStatusCode.OK:
                    return Json(responseData, JsonRequestBehavior.AllowGet);

                case HttpStatusCode.BadRequest:
                    return new HttpStatusCodeResult(statusCode, "Invalid page URL.");

                default:
                    return new HttpStatusCodeResult(statusCode);
            }
        }
    }
}
