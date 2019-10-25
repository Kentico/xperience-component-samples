using System;
using System.Net;

using CMS.DataEngine;
using CMS.DocumentEngine;
using CMS.Helpers;
using CMS.Membership;
using CMS.SiteProvider;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a class that can run the "GetPage" action and return a result model that can be used either in MVC controllers or WebAPI controllers.
    /// </summary>
    internal sealed class RichTextGetPageActionExecutor : IRichTextGetPageActionExecutor
    {
        private readonly IPagesRetriever pagesProvider;


        /// <summary>
        /// Initializes a new instance of the <see cref="RichTextGetPageActionExecutor"/> class.
        /// </summary>
        public RichTextGetPageActionExecutor(IPagesRetriever pagesProvider)
        {
            this.pagesProvider = pagesProvider;
        }


        /// <summary>
        /// Processes the GetPage action.
        /// </summary>
        /// <param name="pagePreviewUrl">The page URL decorated with the preview URL prefix (virtual context).</param>
        public GetPageActionResult ProcessAction(string pagePreviewUrl)
        {
            if (!VirtualContext.IsPreviewLinkInitialized)
            {
                return new GetPageActionResult(HttpStatusCode.Forbidden, statusCodeMessage: "The request is not authenticated via the preview URL decorator.");
            }

            if (String.IsNullOrEmpty(pagePreviewUrl))
            {
                return new GetPageActionResult(HttpStatusCode.BadRequest, statusCodeMessage: "URL is missing the \"pageUrl\" parameter.");
            }

            string pageUrlPath = ExtractPageUrlPath(pagePreviewUrl);
            if (pageUrlPath == null)
            {
                return new GetPageActionResult(HttpStatusCode.BadRequest, statusCodeMessage: "Invalid \"pageUrl\" parameter.");
            }

            TreeNode page = pagesProvider.GetPage(pageUrlPath);
            if (page == null)
            {
                return new GetPageActionResult(HttpStatusCode.NotFound, statusCodeMessage: $"No page was found for the URL '{pageUrlPath}'.");
            }

            if (!page.CheckPermissions(PermissionsEnum.Read, SiteContext.CurrentSiteName, MembershipContext.AuthenticatedUser))
            {
                return new GetPageActionResult(HttpStatusCode.Forbidden, statusCodeMessage: $"You are not authorized to access data of the page '{pageUrlPath}'.");
            }

            var pageModel = new PageLinkModel
            {
                Name = GetPageName(page),
                NodeGuid = page.NodeGUID
            };

            return new GetPageActionResult(HttpStatusCode.OK, pageModel);
        }


        /// <summary>
        /// Extracts the page URL from a full URL that contains a virtual context prefix.
        /// </summary>
        /// <param name="pagePreviewUrl">The page preview URL.</param>
        private string ExtractPageUrlPath(string pagePreviewUrl)
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


        private string GetPageName(TreeNode page)
        {
            // Site root document name is empty => use the site display name
            return page.IsRoot() ? SiteContext.CurrentSite.DisplayName : page.DocumentName;
        }
    }
}
