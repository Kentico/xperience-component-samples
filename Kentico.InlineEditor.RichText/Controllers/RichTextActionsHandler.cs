using System;
using System.Net;

using CMS.Core;
using CMS.DataEngine;
using CMS.DocumentEngine;
using CMS.Helpers;
using CMS.Membership;
using CMS.SiteProvider;

namespace Kentico.Components.Web.Mvc.InlineEditors.Internal
{
    public class RichTextActionsHandler
    {
        private readonly IRichTextApiService richTextApiService = Service.Resolve<IRichTextApiService>();
        
        
        public HttpStatusCode HandleGetPageAction(string pagePreviewUrl, ref object responseData)
        {
            if (!VirtualContext.IsPreviewLinkInitialized)
            {
                return HttpStatusCode.Forbidden;
            }

            string pageUrl = ExtractPageUrl(pagePreviewUrl);
            if (pageUrl == null)
            {
                return HttpStatusCode.BadRequest;
            }

            TreeNode page = richTextApiService.GetPage(pageUrl);
            if (page == null)
            {
                return HttpStatusCode.NotFound;
            }

            if (!page.CheckPermissions(PermissionsEnum.Read, SiteContext.CurrentSiteName, MembershipContext.AuthenticatedUser))
            {
                return HttpStatusCode.Unauthorized;
            }

            string pageName = page.IsRoot() ? SiteContext.CurrentSite.DisplayName : page.DocumentName;
            responseData = new { name = pageName, nodeGuid = page.NodeGUID };

            return HttpStatusCode.OK;
        }


        private string ExtractPageUrl(string pagePreviewUrl)
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
