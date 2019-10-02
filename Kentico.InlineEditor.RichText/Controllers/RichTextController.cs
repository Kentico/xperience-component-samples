using System;
using System.Net;
using System.Web.Http;

using CMS.DocumentEngine;
using CMS.DocumentEngine.Internal;
using CMS.Helpers;
using CMS.SiteProvider;

namespace Kentico.Components.Web.Mvc.InlineEditors.Controllers
{
    public class RichTextController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetPage(string pageUrl)
        {
            if (!VirtualContext.IsPreviewLinkInitialized)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            pageUrl = ExtractPageUrl(pageUrl);
            if (pageUrl == null)
            {
                return BadRequest("Invalid page URL.");
            }

            TreeNode page = AlternativeUrlHelper.GetConflictingPage(new AlternativeUrlInfo()
            {
                AlternativeUrlSiteID = SiteContext.CurrentSiteID,
                AlternativeUrlUrl = AlternativeUrlHelper.NormalizeAlternativeUrl(pageUrl),
            });

            if (page == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                name = page.DocumentName,
                nodeGuid = page.NodeGUID
            });
        }


        public string ExtractPageUrl(string pagePreviewUrl)
        {
            if (String.IsNullOrWhiteSpace(pagePreviewUrl))
            {
                return null;
            }

            var virtualContextSeparator = new string[] { $"/{VirtualContext.VirtualContextSeparator}/" };
            var pageUrlSplit = pagePreviewUrl.Split(virtualContextSeparator, StringSplitOptions.None);

            if (pageUrlSplit.Length < 2)
            {
                return null;
            }

            return pageUrlSplit[1];
        }
    }
}
