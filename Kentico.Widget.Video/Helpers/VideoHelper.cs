using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

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

        public const string YOUTUBE_VIDEO_EMBED_FORMAT = "https://www.youtube.com/embed/";
        public const string VIMEO_VIDEO_EMBED_FORMAT = "https://player.vimeo.com/video/";

        /// <summary>
        /// Gets a regular expression for all the known YouTube & Vimeo URLs.
        /// </summary>
        public const string REGEX_VIDEO_URL = "(?<vimeo>" + REGEX_VIMEO_URL + ")|(?<youtube>" + REGEX_YOUTUBE_URL + ")";

        private static Lazy<Regex> lazyVideoRegex = new Lazy<Regex>(() => new Regex(REGEX_VIDEO_URL, RegexOptions.Compiled | RegexOptions.IgnoreCase));
        private static Regex VideoRegex => lazyVideoRegex.Value;
        
        /// <summary>
        /// Gets YouTube/Vimeo video identifier from given <paramref name="videoUrl"/>.
        /// </summary>
        /// <param name="videoUrl">YouTube or Vimeo video URL.</param>
        /// <returns>YouTube/Vimeo video identifier.</returns>
        /// <exception cref="ArgumentNullException"><paramref name="videoUrl"/> is <c>null</c>.</exception>
        /// <exception cref="UriFormatException"><paramref name="videoUrl"/> is malformed.</exception>
        public static string GetVideoId(string videoUrl)
        {
            videoUrl = videoUrl ?? throw new ArgumentNullException(nameof(videoUrl));
            var videoUri = new UriBuilder(videoUrl).Uri;

            var match = VideoRegex.Match(videoUrl);

            if (match.Success)
            {
                if (!String.IsNullOrEmpty(match.Groups["youtube"].Value))
                {
                    // Search for ?v=XXX in URL
                    var queryDictionary = HttpUtility.ParseQueryString(videoUri.Query);
                    return queryDictionary[YOUTUBE_VIDEO_IDENTIFIER] ?? videoUri.AbsolutePath.Split('/').LastOrDefault();
                }
                if (!String.IsNullOrEmpty(match.Groups["vimeo"].Value))
                {
                    // return last segment in absolute path as a video identifier
                    return videoUri.AbsolutePath.Split('/').LastOrDefault();
                }
             }
             return String.Empty;
        }

        /// <summary>
        /// Gets YouTube/Vimeo video embed format from given <paramref name="videoUrl"/>.
        /// </summary>
        /// <param name="videoUrl">YouTube or Vimeo video Url.</param>
        /// <returns>YouTube/Vimeo video identifier.</returns>
        /// <exception cref="ArgumentNullException"><paramref name="videoUrl"/> is <c>null</c>.</exception>
        /// <exception cref="UriFormatException"><paramref name="videoUrl"/> is malformed.</exception>
        /// <exception cref="NotSupportedException"><paramref name="videoUrl"/> is not a youtube or viemo Url.</exception>
        public static string GetVideoEmbedFormat(string videoUrl)
        {
            videoUrl = videoUrl ?? throw new ArgumentNullException(nameof(videoUrl));
            videoUrl = new UriBuilder(videoUrl).Uri.AbsoluteUri; //Verify string is Url.

            var match = VideoRegex.Match(videoUrl);
            if (match.Success)
            {
                if (!String.IsNullOrEmpty(match.Groups["youtube"].Value))
                {
                    return YOUTUBE_VIDEO_EMBED_FORMAT;
                }
                if (!String.IsNullOrEmpty(match.Groups["vimeo"].Value))
                {
                    return VIMEO_VIDEO_EMBED_FORMAT;
                }
            }
            else
            {
                throw new NotSupportedException($"{nameof(videoUrl)} {videoUrl} is not a supported url.");
            }
            return String.Empty;
        }
    }
}
