using System;
using System.Web;

namespace Kentico.Widget.Video.Helpers
{
    /// <summary>
    /// Helper methods for working with YouTube videos.
    /// </summary>
    public static class YoutubeVideoHelper
    {
        private const string VIDEO_IDENTIFIER = "v";


        /// <summary>
        /// Gets a regular expression for all the known YouTube URLs.
        /// </summary>
        public const string REGEX_YOUTUBE_URL = @"^(http(s)?:\/\/)?((w){3}.)?(m.)?youtu(be|.be)?(\.com)?\/.+";


        /// <summary>
        /// Gets YouTube video identifier from given <paramref name="youtubeUrl"/>.
        /// </summary>
        /// <param name="youtubeUrl">YouTube video URL.</param>
        /// <returns>YouTube video identifier.</returns>
        /// <exception cref="ArgumentNullException"><paramref name="youtubeUrl"/> is <c>null</c>.</exception>
        /// <exception cref="UriFormatException"><paramref name="youtubeUrl"/> is malformed.</exception>
        public static string GetVideoId(string youtubeUrl)
        {
            youtubeUrl = youtubeUrl ?? throw new ArgumentNullException(nameof(youtubeUrl));
            var youtubeUri = new UriBuilder(youtubeUrl).Uri;

            // Search for ?v=XXX in URL
            var queryDictionary = HttpUtility.ParseQueryString(youtubeUri.Query);
            if (queryDictionary.Get(VIDEO_IDENTIFIER) != null)
            {
                return queryDictionary[VIDEO_IDENTIFIER];
            }

            // Otherwise return absolute path without starting '/' as a video identifier
            return youtubeUri.AbsolutePath.Remove(0, 1);
        }


    }
}
