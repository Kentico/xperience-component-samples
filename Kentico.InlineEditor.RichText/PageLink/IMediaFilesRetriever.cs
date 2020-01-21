using System;

using CMS.MediaLibrary;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Provides an interface for retrieving media files.
    /// </summary>
    internal interface IMediaFilesRetriever
    {
        /// <summary>
        /// Returns a media file by its URL.
        /// </summary>
        /// <param name="urlPath">The media file relative URL path (no application path).</param>
        /// <returns><see cref="MediaFileInfo"/> representing the media file, otherwise returns null.</returns>
        /// <exception cref="ArgumentNullException"> if <paramref name="pageUrl"/> is <c>null</c>.</exception>
        MediaFileInfo GetMediaFile(string urlPath);
    }
}
