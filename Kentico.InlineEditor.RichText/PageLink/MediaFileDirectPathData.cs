namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents media file data determined by a direct media file URL.
    /// </summary>
    internal class MediaFileDirectPathData
    {
        /// <summary>
        /// Gets or sets the library folder.
        /// </summary>
        public string LibraryFolder { get; set; }

        /// <summary>
        /// Gets or sets the media file path relative to the library folder.
        /// </summary>
        public string MediaFilePath { get; set; }
    }
}
