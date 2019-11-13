using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

using Kentico.Components.Web.Mvc.Widgets.Models;

namespace Kentico.Components.Web.Mvc.Widgets.Helpers
{
    /// <summary>
    /// Helper methods for working with YouTube/Vimeo videos.
    /// </summary>
    public static class VideoHelper
    {
        private const string YOUTUBE_VIDEO_IDENTIFIER = "v";
        private const string REGEX_YOUTUBE_URL = @"(http(s)?:\/\/)?((w){3}.)?(m.)?youtu(be|.be)?(\.com)?\/.+";
        private const string REGEX_VIMEO_URL = @"(http(s)?:\/\/)?((w){3}.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)";

        public const string YOUTUBE_VIDEO_URL_EMBED_FORMAT = "https://www.youtube.com/embed/";
        public const string VIMEO_VIDEO_URL_EMBED_FORMAT = "https://player.vimeo.com/video/";

        /// <summary>
        /// Gets a regular expression for all the known YouTube & Vimeo URLs.
        /// </summary>
        public const string REGEX_VIDEO_URL = "(?<vimeo>" + REGEX_VIMEO_URL + ")|(?<youtube>" + REGEX_YOUTUBE_URL + ")";

        private static Lazy<Regex> lazyVideoRegex = new Lazy<Regex>(() => new Regex(REGEX_VIDEO_URL, RegexOptions.Compiled | RegexOptions.IgnoreCase));
        private static Regex VideoRegex => lazyVideoRegex.Value;


        /// <summary>
        /// Gets YouTube/Vimeo video embed URL for given <paramref name="video"/>.
        /// </summary>
        /// <param name="video">Video model.</param>
        /// <exception cref="ArgumentNullException"><paramref name="video"/> is <c>null</c>.</exception>
        /// <exception cref="NotSupportedException"><paramref name="video"/> doesn't refer to a Youtube or Vimeo video.</exception>
        public static string GetVideoEmbedUrl(VideoModel video)
        {
            video = video ?? throw new ArgumentNullException(nameof(video));

            switch (video.VideoKind)
            {
                case VideoKindEnum.Youtube:
                    return YOUTUBE_VIDEO_URL_EMBED_FORMAT + video.VideoId;
                case VideoKindEnum.Vimeo:
                    return VIMEO_VIDEO_URL_EMBED_FORMAT + video.VideoId;
                default:
                    throw new NotSupportedException($"{video.VideoUrl} is not a supported video format.");
            }
        }


        /// <summary>
        /// Gets YouTube/Vimeo video model for given <paramref name="videoUrl"/>.
        /// </summary>
        /// <remarks>
        /// Returns empty <see cref="VideoModel"/> if <paramref name="videoUrl"/> is null.
        /// </remarks>
        /// <param name="videoUrl">YouTube or Vimeo video URL.</param>
        /// <exception cref="NotSupportedException"><paramref name="video"/> doesn't refer to a Youtube or Vimeo video.</exception>
        /// <exception cref="UriFormatException"><paramref name="videoUrl"/> is malformed URL.</exception>
        public static VideoModel GetVideoModel(string videoUrl)
        {
            if (videoUrl == null)
            {
                return new VideoModel();
            }

            // Throws exception if videoUrl is invalid URL.
            var videoUri = new UriBuilder(videoUrl).Uri;
            var match = VideoRegex.Match(videoUrl);

            if (match.Success)
            {
                string videoId = String.Empty;
                VideoKindEnum videoKind = VideoKindEnum.Unknown;

                if (!String.IsNullOrEmpty(match.Groups["youtube"].Value))
                {
                    // Search for ?v=XXX in URL.
                    var queryDictionary = HttpUtility.ParseQueryString(videoUri.Query);
                    videoId = queryDictionary[YOUTUBE_VIDEO_IDENTIFIER] ?? videoUri.AbsolutePath.Split('/').LastOrDefault();
                    videoKind = VideoKindEnum.Youtube;
                }
                else if (!String.IsNullOrEmpty(match.Groups["vimeo"].Value))
                {
                    // Return last segment in absolute path as a video identifier.
                    videoId = videoUri.AbsolutePath.Split('/').LastOrDefault();
                    videoKind = VideoKindEnum.Vimeo;
                }

                return new VideoModel(videoUrl, videoId, videoKind);
            }

            throw new NotSupportedException($"{videoUrl} doesn't refer to supported video type.");
        }
    }
}
