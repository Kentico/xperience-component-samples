using System;
using System.Web;

namespace Kentico.Widget.Video.Helpers
{
    /// <summary>
    /// Helper methods for working with Youtube videos.
    /// </summary>
    public static class YoutubeVideoHelper
    {
        private const string VIDEO_IDENTIFIER = "v";


        /// <summary>
        /// Gets Youtube video identifier from given <paramref name="youtubeUrl"/>.
        /// </summary>
        /// <param name="youtubeUrl">Youtube video URL.</param>
        /// <returns>Youtube video identifier.</returns>
        /// <exception cref="ArgumentNullException"><paramref name="youtubeUrl"/> is <c>null</c>.</exception>
        /// <exception cref="UriFormatException"><paramref name="youtubeUrl"/> is malformatted.</exception>
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
