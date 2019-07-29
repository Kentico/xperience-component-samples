using System;
using System.Linq;
using System.Web.Mvc;

using CMS.DocumentEngine;

using Kentico.PageBuilder.Web.Mvc;
using Kentico.Web.Mvc;

namespace Kentico.AspNet.Mvc.SandboxSite
{
    public class PageController : Controller
    {
        // GET: Home
        public ActionResult Index(string nodeAlias)
        {
            if (String.IsNullOrEmpty(nodeAlias))
            {
                return HttpNotFound();
            }

            TreeNode page = DocumentHelper
                .GetDocuments("SandboxSite.DevelopmentPage")
                .WhereEquals("NodeAlias", nodeAlias)
                .OnCurrentSite()
                .TopN(1)
                .FirstOrDefault();

            if (page == null)
            {
                return HttpNotFound();
            }

            HttpContext
                .Kentico()
                .PageBuilder()
                .Initialize(page.DocumentID);

            ViewBag.Title = page.DocumentName;
            return View();
        }
    }
}