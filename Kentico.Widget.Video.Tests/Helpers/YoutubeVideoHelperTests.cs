using System;
using System.Text.RegularExpressions;

using NUnit.Framework;

namespace Kentico.Widget.Video.Helpers.Tests
{
    [TestFixture]
    public static class YoutubeVideoHelperTests
    {
        public class GetVideoIdTests
        {
            [Test]
            public void GetVideoId_YoutubeUrlIsNull_ThrowsArgumentNullException()
            {
                // Act & Assert
                Assert.Throws<ArgumentNullException>(() => YoutubeVideoHelper.GetVideoId(null));
            }


            [Test]
            public void GetVideoId_YoutubeUrlIsMalformatted_ThrowsUriFormatException()
            {
                // Act & Assert
                Assert.Throws<UriFormatException>(() => YoutubeVideoHelper.GetVideoId("blah blah..."));
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
            public void GetVideoId_ProvidedYoutubeUrl_GetCorrectVideoId(string youtubeUrl, string expected)
            {
                // Act
                var videoId = YoutubeVideoHelper.GetVideoId(youtubeUrl);

                // Assert
                Assert.AreEqual(expected, videoId);
            }
        }


        public class RegexYouTubeURLTests
        {
            private readonly Regex regex = new Regex(YoutubeVideoHelper.REGEX_YOUTUBE_URL);


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
            [TestCase("http://youtu.be/t-ZRX8984sc", true)]
            [TestCase("http://youtu.ce/t-ZRX8984sc", false)]
            public void RegexYouTubeURL_AllPossibleYouTubeURLs_ReturnsCorrectResult(string url, bool isValidYouTubeURL)
            {
                // Act & Assert
                Assert.That(regex.IsMatch(url), Is.EqualTo(isValidYouTubeURL));
            }
        }
    }
}
