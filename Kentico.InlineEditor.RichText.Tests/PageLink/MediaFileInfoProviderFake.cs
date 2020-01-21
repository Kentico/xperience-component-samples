using System;

using CMS.MediaLibrary;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class MediaFileInfoProviderFake : MediaFileInfoProvider
    {
        private readonly MediaFileInfo mediaFile;


        /// <summary>
        /// Initializes a fake provider that will return the given media file.
        /// </summary>
        /// <param name="mediaFileInfo">The media file to return.</param>
        public MediaFileInfoProviderFake(MediaFileInfo mediaFile)
        {
            this.mediaFile = mediaFile;
        }


        protected override MediaFileInfo GetMediaFileInfoInternal(Guid guid, string siteName)
        {
            return mediaFile;
        }


        protected override MediaFileInfo GetMediaFileInfoInternal(string siteName, string mediaFilePath, string libraryFolder)
        {
            return mediaFile;
        }
    }
}
