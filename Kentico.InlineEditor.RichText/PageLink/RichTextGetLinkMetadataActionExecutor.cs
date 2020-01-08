using System;
using System.Net;
using System.Text.RegularExpressions;

using CMS.DataEngine;
using CMS.DocumentEngine;
using CMS.Helpers;
using CMS.MediaLibrary;
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
        private readonly IMediaFilesRetriever mediaFilesRetriever;
        private readonly string applicationPath;
        private readonly string siteName;


        /// <summary>
        /// Initializes a new instance of the <see cref="RichTextGetLinkMetadataActionExecutor"/> class.
        /// </summary>
        public RichTextGetLinkMetadataActionExecutor(IPagesRetriever pagesProvider, IMediaFilesRetriever mediaFilesRetriever, string applicationPath, string siteName)
        {
            if (String.IsNullOrEmpty(applicationPath))
            {
                throw new ArgumentException(nameof(applicationPath));
            }

            this.pagesProvider = pagesProvider ?? throw new ArgumentNullException(nameof(pagesProvider));
            this.mediaFilesRetriever = mediaFilesRetriever ?? throw new ArgumentNullException(nameof(mediaFilesRetriever));
            this.applicationPath = applicationPath;
            this.siteName = siteName;
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

            LinkModel linkModel = new LinkModel()
            {
                LinkURL = linkUrl,
                LinkType = LinkTypeEnum.External
            };

            // Try to identify particular local link types
            if (IsLocalUrl(linkUrl))
            {
                LinkModel localLinkModel = null;
                string urlPath = GetUrlPath(linkUrl);

                // Media file
                var mediaFile = mediaFilesRetriever.GetMediaFile(urlPath);
                if (mediaFile != null)
                {
                    localLinkModel = GetMediaFileLinkModel(mediaFile);
                }

                // Page
                if (localLinkModel == null)
                {
                    var page = pagesProvider.GetPage(urlPath);
                    if (page != null)
                    {
                        if (!page.CheckPermissions(PermissionsEnum.Read, siteName, MembershipContext.AuthenticatedUser))
                        {
                            return new GetLinkMetadataActionResult(HttpStatusCode.Forbidden, statusCodeMessage: $"You are not authorized to access data of the page '{urlPath}'.");
                        }

                        localLinkModel = GetPageLinkModel(page);
                    }
                }

                // Local link with of an unknown type
                if (localLinkModel == null)
                {
                    localLinkModel = GetLocalLinkModel();
                }

                // Store the local URL path that does not contain the virtual context data
                localLinkModel.LinkURL = GetAbsolutePath(urlPath);

                linkModel = localLinkModel;
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


        private LinkModel GetMediaFileLinkModel(MediaFileInfo mediaFile)
        {
            var linkModel = new LinkModel
            {
                LinkType = LinkTypeEnum.MediaFile,
                LinkMetadata = new LinkMetadata
                {
                    Name = mediaFile.FileName,
                    Identifier = mediaFile.FileGUID
                }
            };

            return linkModel;
        }


        private LinkModel GetLocalLinkModel()
        {
            var linkModel = new LinkModel
            {
                LinkType = LinkTypeEnum.Local
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
            relativeUrl = RemoveVirtualContextData(relativeUrl);

            return relativeUrl;
        }


        private bool IsLocalUrl(string url)
        {
            // Identify a local URL (exclude protocol-less URLs if that application is in the site root)
            return (url.StartsWith(applicationPath, StringComparison.InvariantCultureIgnoreCase) && !url.StartsWith("//"));
        }


        private string GetAbsolutePath(string path)
        {
            return $"{applicationPath.TrimEnd('/')}/{path.TrimStart('/')}";
        }


        private string RemoveApplicationPath(string absolutePath)
        {
            return "/" + absolutePath.Substring(applicationPath.Length).TrimStart('/');
        }


        private string RemoveVirtualContextData(string path)
        {
            // Remove the virtual context prefix
            if (VirtualContext.ContainsVirtualContextPrefix(path))
            {
                // Remove the path hash
                path = URLHelper.RemoveParameterFromUrl(path, "uh");

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
