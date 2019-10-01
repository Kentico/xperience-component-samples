using System;
using System.Net;
using System.Web;
using System.Web.Http;

using CMS.DocumentEngine;
using CMS.DocumentEngine.Internal;
using CMS.Helpers;
using CMS.SiteProvider;

using Kentico.PageBuilder.Web.Mvc;
using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors.Controllers
{
    public class RichTextController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GetPage(string pageUrl)
        {
            // TODO: Check that Preview mode is initialized
            //if (!HttpContext.Current.Kentico().PageBuilder().EditMode)
            //{
            //    return StatusCode(HttpStatusCode.Forbidden);
            //}

            var pageUrlSplit = pageUrl.Split(new string[] { $"/{VirtualContext.VirtualContextSeparator}/" }, StringSplitOptions.None);
            if (pageUrlSplit.Length < 2)
            {
                return BadRequest("Invalid page URL.");
            }

            var altUrl = new AlternativeUrlInfo()
            {
                AlternativeUrlSiteID = SiteContext.CurrentSiteID,
                AlternativeUrlUrl = AlternativeUrlHelper.NormalizeAlternativeUrl(pageUrlSplit[1]),
            };

            // Get page by its URL
            TreeNode selectedPage = AlternativeUrlHelper.GetConflictingPage(altUrl);

            if (selectedPage == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                name = selectedPage.DocumentName,
                nodeGuid = selectedPage.NodeGUID
            });
        }
    }
}
