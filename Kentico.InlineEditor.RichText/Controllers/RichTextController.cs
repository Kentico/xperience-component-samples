using System;
using System.Net;
using System.Web.Http;

using CMS.Core;
using CMS.DocumentEngine;
using CMS.Helpers;

namespace Kentico.Components.Web.Mvc.InlineEditors.Controllers
{
    public class RichTextController : ApiController
    {
        private readonly IRichTextApiService richTextApiService;

        
        public RichTextController()
        {
            richTextApiService = Service.Resolve<IRichTextApiService>();
        }


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

            TreeNode page = richTextApiService.GetPage(pageUrl);
            if (page == null)
            {
                return NotFound();
            }

            return Ok<dynamic>(new
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
