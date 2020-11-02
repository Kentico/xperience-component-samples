namespace Kentico.Components
{
    /// <summary>
    /// View model for video widget.
    /// </summary>
    public class VideoWidgetViewModel
    {
        /// <summary>
        /// Video URL.
        /// </summary>
        public string VideoUrl { get; }


        /// <summary>
        /// Video identifier.
        /// </summary>
        public string VideoId { get; }


        /// <summary>
        /// Video kind.
        /// </summary>
        public VideoKindEnum VideoKind { get; }


        /// <summary>
        /// Create a new instance of <see cref="VideoWidgetViewModel"/>
        /// </summary>
        public VideoWidgetViewModel()
        {
        }


        /// <summary>
        /// Create a new instance of <see cref="VideoWidgetViewModel"/>
        /// </summary>
        /// <param name="videoUrl">Video URL.</param>
        /// <param name="videoId">Video identifier.</param>
        /// <param name="videoKind">Video kind.</param>
        public VideoWidgetViewModel(string videoUrl, string videoId, VideoKindEnum videoKind)
        {
            VideoUrl = videoUrl;
            VideoId = videoId;
            VideoKind = videoKind;
        }
    }
}
