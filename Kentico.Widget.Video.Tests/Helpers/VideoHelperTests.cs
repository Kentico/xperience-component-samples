using System;
using System.Text.RegularExpressions;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Widgets.Helpers.Tests
{
    [TestFixture]
    public static class VideoHelperTests
    {
        public class GetVideoIdTests
        {
            [Test]
            public void GetVideoId_VideoUrlIsNull_ThrowsArgumentNullException()
            {
                // Act & Assert
                Assert.Throws<ArgumentNullException>(() => VideoHelper.GetVideoId(null));
            }


            [Test]
            public void GetVideoId_VideoUrlIsMalformatted_ThrowsUriFormatException()
            {
                // Act & Assert
                Assert.Throws<UriFormatException>(() => VideoHelper.GetVideoId("blah blah..."));
            }


            [TestCase("http://youtube.com/watch?v=iwGFalTRHDA", "iwGFalTRHDA")]
            [TestCase("http://www.youtube.com/watch?v=iwGFalTRHDA&feature=related", "iwGFalTRHDA")]
            [TestCase("https://youtube.com/iwGFalTRHDA", "iwGFalTRHDA")]
            [TestCase("http://youtu.be/n17B_uFF4cA", "n17B_uFF4cA")]
            [TestCase("youtube.com/iwGFalTRHDA", "iwGFalTRHDA")]
            [TestCase("youtube.com/n17B_uFF4cA", "n17B_uFF4cA")]
            [TestCase("m.youtube.com/iwGFalTRHDA", "iwGFalTRHDA")]
            [TestCase("m.youtube.com/n17B_uFF4cA", "n17B_uFF4cA")]
            [TestCase("http://www.youtube.com/embed/watch?feature=player_embedded&v=r5nB9u4jjy4", "r5nB9u4jjy4")]
            [TestCase("https://www.youtube.com/embed/lkazf4nMYwU", "lkazf4nMYwU")]
            [TestCase("http://www.youtube.com/watch?v=t-ZRX8984sc", "t-ZRX8984sc")]
            [TestCase("http://youtu.be/t-ZRX8984sc", "t-ZRX8984sc")]
            [TestCase("https://m.youtube.com/iwGFalTRHDA", "iwGFalTRHDA")]
            [TestCase("https://vimeo.com/62092214", "62092214")]
            [TestCase("http://vimeo.com/62092214", "62092214")]
            [TestCase("https://www.vimeo.com/62092214", "62092214")]
            [TestCase("https://vimeo.com/channels/documentaryfilm/128373915", "128373915")]
            [TestCase("https://vimeo.com/groups/musicvideo/videos/126199390", "126199390")]
            [TestCase("https://vimeo.com/62092214?query=foo", "62092214")]
            public void GetVideoId_ProvidedYoutubeOrVimeoUrl_GetCorrectVideoId(string videoUrl, string expected)
            {
                // Act
                var videoId = VideoHelper.GetVideoId(videoUrl);

                // Assert
                Assert.AreEqual(expected, videoId);
            }
        }

        public class GetVideoEmbedFormatTests
        {
            [Test]
            public void GetVideoEmbedFormat_VideoUrlIsNull_ThrowsArgumentNullException()
            {
                // Act & Assert
                Assert.Throws<ArgumentNullException>(() => VideoHelper.GetVideoEmbedFormat(null));
            }

            [Test]
            public void GetVideoEmbedFormat_VideoUrlIsMalformatted_ThrowsUriFormatException()
            {
                // Act & Assert
                Assert.Throws<UriFormatException>(() => VideoHelper.GetVideoEmbedFormat("blah blah..."));
            }

            [Test]
            public void GetVideoEmbedFormat_VideoUrlIsNotASupportedURL_ThrowsNotSupportedException()
            {
                // Act & Assert
                Assert.Throws<System.NotSupportedException>(() => VideoHelper.GetVideoEmbedFormat("https://www.google.com/"));
            }


            [TestCase("http://youtube.com/watch?v=iwGFalTRHDA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("http://www.youtube.com/watch?v=iwGFalTRHDA&feature=related", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("https://youtube.com/iwGFalTRHDA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("http://youtu.be/n17B_uFF4cA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("youtube.com/iwGFalTRHDA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("youtube.com/n17B_uFF4cA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("m.youtube.com/iwGFalTRHDA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("m.youtube.com/n17B_uFF4cA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("http://www.youtube.com/embed/watch?feature=player_embedded&v=r5nB9u4jjy4", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("https://www.youtube.com/embed/lkazf4nMYwU", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("http://www.youtube.com/watch?v=t-ZRX8984sc", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("http://youtu.be/t-ZRX8984sc", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("https://m.youtube.com/iwGFalTRHDA", VideoHelper.YOUTUBE_VIDEO_EMBED_FORMAT)]
            [TestCase("https://vimeo.com/62092214", VideoHelper.VIMEO_VIDEO_EMBED_FORMAT)]
            [TestCase("http://vimeo.com/62092214", VideoHelper.VIMEO_VIDEO_EMBED_FORMAT)]
            [TestCase("https://www.vimeo.com/62092214", VideoHelper.VIMEO_VIDEO_EMBED_FORMAT)]
            [TestCase("https://vimeo.com/channels/documentaryfilm/128373915", VideoHelper.VIMEO_VIDEO_EMBED_FORMAT)]
            [TestCase("https://vimeo.com/groups/musicvideo/videos/126199390", VideoHelper.VIMEO_VIDEO_EMBED_FORMAT)]
            [TestCase("https://vimeo.com/62092214?query=foo", VideoHelper.VIMEO_VIDEO_EMBED_FORMAT)]
            public void GetVideoEmbedFormat_ProvidedYoutubeOrVimeoUrl_GetCorrectVideoFormat(string videoUrl, string expected)
            {
                // Act
                string format = VideoHelper.GetVideoEmbedFormat(videoUrl);

                // Assert
                Assert.AreEqual(expected, format);
            }
        }


        public class RegexVideoUrlTests
        {
            private readonly Regex regex = new Regex(VideoHelper.REGEX_VIDEO_URL);


            [TestCase("http://youtube.com", false)]
            [TestCase("http://youtube.com/", false)]
            [TestCase("http://youtube.com/abc", true)]
            [TestCase("http://youtube.com/watch?v=iwGFalTRHDA", true)]
            [TestCase("http://www.youtube.com/watch?v=iwGFalTRHDA&feature=related", true)]
            [TestCase("https://youtube.com/iwGFalTRHDA", true)]
            [TestCase("http://youtu.be/n17B_uFF4cA", true)]
            [TestCase("youtube.com/iwGFalTRHDA", true)]
            [TestCase("m.youtube.com/iwGFalTRHDA", true)]
            [TestCase("m.youtube.com/n17B_uFF4cA", true)]
            [TestCase("https://m.youtube.com/iwGFalTRHDA", true)]
            [TestCase("http://www.youtube.com/embed/watch?feature=player_embedded&v=r5nB9u4jjy4", true)]
            [TestCase("http://www.youtube.com/watch?v=t-ZRX8984sc", true)]
            [TestCase("http://youtu.ce/t-ZRX8984sc", false)]
            [TestCase("https://vimeo.com/62092214", true)]
            [TestCase("http://vimeo.com/62092214", true)]
            [TestCase("https://www.vimeo.com/62092214", true)]
            [TestCase("https://vimeo.com/channels/documentaryfilm/128373915", true)]
            [TestCase("https://vimeo.com/groups/musicvideo/videos/126199390", true)]
            [TestCase("https://vimeo.com/62092214?query=foo", true)]
            [TestCase("http://vimeo/62092214", false)]
            [TestCase("http://vimeo.com/foo", false)]
            [TestCase("https://vimeo.com/channels/foo-barr/documentaryfilm/128373915", false)]
            [TestCase("http://vimeo.com/groups/musicvideo/vid/126199390", false)]
            [TestCase("https://vimeo.com.omomom/62092214?query=foo", false)]
            public void RegexYouTubeUrl_AllPossibleVideoUrls_ReturnsCorrectResult(string url, bool isValidVideoUrl)
            {
                // Act & Assert
                Assert.That(regex.IsMatch(url), Is.EqualTo(isValidVideoUrl));
            }
        }
    }
}
