using Kentico.Components.Web.Mvc.Widgets.Helpers;

namespace Kentico.Components.Web.Mvc.Widgets.Models
{
    /// <summary>
    /// View model for video widget.
    /// </summary>
    public class VideoModel
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
        /// Create a new instance of <see cref="VideoModel"/>
        /// </summary>
        /// <param name="videoUrl">Video URL.</param>
        /// <param name="videoId">Video identifier.</param>
        /// <param name="videoKind">Video kind.</param>
        public VideoModel(string videoUrl, string videoId, VideoKindEnum videoKind)
        {
            VideoUrl = videoUrl;
            VideoId = videoId;
            VideoKind = videoKind;
        }
    }
}