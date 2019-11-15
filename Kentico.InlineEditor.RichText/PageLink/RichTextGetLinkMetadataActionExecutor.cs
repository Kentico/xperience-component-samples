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
    /// Represents a class that can run the "GetLinkMetadata" action and return a result model that can be used either in MVC controllers or WebAPI controllers.
    /// </summary>
    internal sealed class RichTextGetLinkMetadataActionExecutor : IRichTextGetLinkMetadataActionExecutor
    {
        private readonly IPagesRetriever pagesProvider;


        /// <summary>
        /// Initializes a new instance of the <see cref="RichTextGetLinkMetadataActionExecutor"/> class.
        /// </summary>
        public RichTextGetLinkMetadataActionExecutor(IPagesRetriever pagesProvider)
        {
            this.pagesProvider = pagesProvider;
        }


        /// <summary>
        /// Processes the GetLinkMetadata action.
        /// </summary>
        /// <param name="linkUrl">The link URL.</param>
        public GetLinkMetadataActionResult ProcessAction(string linkUrl)
        {
            if (!VirtualContext.IsPreviewLinkInitialized)
            {
                return new GetLinkMetadataActionResult(HttpStatusCode.Forbidden, statusCodeMessage: "The request is not authenticated via the preview URL decorator.");
            }

            if (String.IsNullOrEmpty(linkUrl))
            {
                return new GetLinkMetadataActionResult(HttpStatusCode.BadRequest, statusCodeMessage: "URL is missing the \"pageUrl\" parameter.");
            }

            string pageUrlPath = ExtractPageUrlPath(linkUrl);
            if (pageUrlPath == null)
            {
                return new GetLinkMetadataActionResult(HttpStatusCode.BadRequest, statusCodeMessage: "Invalid \"pageUrl\" parameter.");
            }

            TreeNode page = pagesProvider.GetPage(pageUrlPath);
            if (!page.CheckPermissions(PermissionsEnum.Read, SiteContext.CurrentSiteName, MembershipContext.AuthenticatedUser))
            {
                return new GetLinkMetadataActionResult(HttpStatusCode.Forbidden, statusCodeMessage: $"You are not authorized to access data of the page '{pageUrlPath}'.");
            }

            var linkModel = new LinkModel();

            if (page != null)
            {
                linkModel.LinkType = LinkTypeEnum.Page;
                linkModel.LinkMetadata = new LinkMetadata
                {
                    Name = GetPageName(page),
                    Identifier = page.NodeGUID
                };
            };

            return new GetLinkMetadataActionResult(HttpStatusCode.OK, linkModel);
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
