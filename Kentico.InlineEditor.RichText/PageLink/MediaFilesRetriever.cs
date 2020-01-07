using System;
using System.Text.RegularExpressions;

using CMS.DataEngine;
using CMS.Helpers;
using CMS.MediaLibrary;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Retrieves media files for the specified parameters.
    /// </summary>
    internal sealed class MediaFilesRetriever : IMediaFilesRetriever
    {
        private readonly Regex GuidReg = RegexHelper.GetRegex("[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}");
        private readonly string siteName;
        private const string MEDIA_LIBRARIES_FOLDER_SETTING_KEY = "CMSMediaLibrariesFolder";


        /// <summary>
        /// Initializes a new instance of the <see cref="PagesRetriever"/> class.
        /// </summary>
        /// <param name="siteName">The site which will be searched.</param>
        /// <exception cref="ArgumentNullException"> if <paramref name="siteName"/> is <c>null</c>.</exception>
        public MediaFilesRetriever(string siteName)
        {
            this.siteName = siteName ?? throw new ArgumentNullException(nameof(siteName));
        }


        /// <summary>
        /// Returns a media file by its URL.
        /// </summary>
        /// <param name="urlPath">The media file relative URL path (no application path).</param>
        /// <returns><see cref="MediaFileInfo"/> representing the media file, otherwise returns null.</returns>
        /// <exception cref="ArgumentNullException"> if <paramref name="pageUrl"/> is <c>null</c>.</exception>
        public MediaFileInfo GetMediaFile(string urlPath)
        {
            // Treat the URL as a permanent URL
            if (urlPath.StartsWith("/getmedia/", StringComparison.OrdinalIgnoreCase))
            {
                Match m = GuidReg.Match(urlPath);
                if (m.Success)
                {
                    Guid guid = new Guid(m.Groups[0].Value);

                    return MediaFileInfoProvider.GetMediaFileInfo(guid, siteName);
                }
            }
            // Treat the URL as a direct URL
            else
            {
                string mediaLibraryRootFolder = GetMediaFileLibraryRootFolder();

                if (urlPath.StartsWith(mediaLibraryRootFolder, StringComparison.OrdinalIgnoreCase))
                {
                    var mediaFilePathData = GetMediaFileDirectPathData(urlPath, mediaLibraryRootFolder);
                    if (mediaFilePathData != null)
                    {
                        return MediaFileInfoProvider.GetMediaFileInfo(siteName, mediaFilePathData.MediaFilePath, mediaFilePathData.LibraryFolder);
                    }
                }
            }

            return null;
        }


        /// <summary>
        /// Returns media file data parsed from the direct media file URL.
        /// </summary>
        private MediaFileDirectPathData GetMediaFileDirectPathData(string path, string mediaLibraryRootFolder)
        {
            string mediaFilePathWithLibraryFolder = path.Substring(mediaLibraryRootFolder.Length);
            var parts = mediaFilePathWithLibraryFolder.Split(new[] { '/' }, 2, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 2)
            {
                return new MediaFileDirectPathData
                {
                    LibraryFolder = parts[0],
                    MediaFilePath = parts[1]
                };
            }

            return null;
        }


        /// <summary>
        /// Gets the media library root folder. Takes in account also custom media library folder settings.
        /// </summary>
        /// <returns>Returns the media library root folder in the format: "/folder/maybeSiteName/".</returns>
        private string GetMediaFileLibraryRootFolder()
        {
            string mediaLibraryFolder = SettingsKeyInfoProvider.GetValue($"{siteName}.{MEDIA_LIBRARIES_FOLDER_SETTING_KEY}");
            if (String.IsNullOrEmpty(mediaLibraryFolder))
            {
                mediaLibraryFolder = $"/{siteName}/media/";
            }
            else if (mediaLibraryFolder.StartsWith("~/", StringComparison.Ordinal))
            {
                mediaLibraryFolder = $"/{mediaLibraryFolder.TrimStart('~').Trim('/')}/";

                // Check if site specific folder should be used
                if (MediaLibraryHelper.UseMediaLibrariesSiteFolder(siteName))
                {
                    mediaLibraryFolder = $"{mediaLibraryFolder}{siteName}/";
                }
            }

            return mediaLibraryFolder;
        }
    }
}
