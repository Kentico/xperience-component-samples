using System;
using System.Net;
using System.Text.RegularExpressions;

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
        private readonly string applicationPath;


        /// <summary>
        /// Initializes a new instance of the <see cref="RichTextGetLinkMetadataActionExecutor"/> class.
        /// </summary>
        public RichTextGetLinkMetadataActionExecutor(IPagesRetriever pagesProvider, string applicationPath)
        {
            if (String.IsNullOrEmpty(applicationPath))
            {
                throw new ArgumentException(nameof(applicationPath));
            }

            this.pagesProvider = pagesProvider ?? throw new ArgumentNullException(nameof(pagesProvider));
            this.applicationPath = applicationPath;
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
                return new GetLinkMetadataActionResult(HttpStatusCode.BadRequest, statusCodeMessage: "URL is missing the \"linkUrl\" parameter.");
            }

            var linkModel = new LinkModel();

            if (IsLocalUrl(linkUrl))
            {
                string urlPath = GetUrlPath(linkUrl);

                var page = pagesProvider.GetPage(urlPath);
                if (page != null)
                {
                    if (!page.CheckPermissions(PermissionsEnum.Read, SiteContext.CurrentSiteName, MembershipContext.AuthenticatedUser))
                    {
                        return new GetLinkMetadataActionResult(HttpStatusCode.Forbidden, statusCodeMessage: $"You are not authorized to access data of the page '{urlPath}'.");
                    }

                    linkModel = GetPageLinkModel(page);
                }
            }

            return new GetLinkMetadataActionResult(HttpStatusCode.OK, linkModel);
        }


        private LinkModel GetPageLinkModel(TreeNode page)
        {
            var linkModel = new LinkModel
            {
                LinkType = LinkTypeEnum.Page,
                LinkMetadata = new LinkMetadata
                {
                    Name = GetPageName(page),
                    Identifier = page.NodeGUID
                }
            };

            return linkModel;
        }


        /// <summary>
        /// Gets the local URL path without the application path and virtual context prefix.
        /// </summary>
        /// <returns>
        /// Local URL path in the format: /path?param=1#anchor
        /// </returns>
        private string GetUrlPath(string url)
        {
            string relativeUrl = RemoveApplicationPath(url);
            relativeUrl = RemoveVirtualContextPrefix(relativeUrl);

            return relativeUrl;
        }


        private bool IsLocalUrl(string url)
        {
            // Identify a local URL (exclude protocol-less URLs if that application is in the site root)
            return (url.StartsWith(applicationPath, StringComparison.InvariantCultureIgnoreCase) && !url.StartsWith("//"));
        }


        private string RemoveApplicationPath(string absolutePath)
        {
            return "/" + absolutePath.Substring(applicationPath.Length).TrimStart('/');
        }


        private string RemoveVirtualContextPrefix(string path)
        {
            // Remove the virtual context prefix
            if (VirtualContext.ContainsVirtualContextPrefix(path))
            {
                Regex virtualContextPathPrefixRegex = RegexHelper.GetRegex($"{VirtualContext.VirtualContextPrefix}.*/{VirtualContext.VirtualContextSeparator}");

                // Remove the virtual context prefix "/cmsctx/.../-"
                return virtualContextPathPrefixRegex.Replace(path, String.Empty);
            }

            return path;
        }


        private string GetPageName(TreeNode page)
        {
            // Site root document name is empty => use the site display name
            return page.IsRoot() ? SiteContext.CurrentSite.DisplayName : page.DocumentName;
        }
    }
}
