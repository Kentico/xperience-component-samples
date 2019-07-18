using System;

using NUnit.Framework;

using static Kentico.Widget.Video.Helpers.YoutubeVideoHelper;

namespace Kentico.Widget.Video.Tests
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
                Assert.Throws<ArgumentNullException>(() => GetVideoId(null));
            }


            [Test]
            public void GetVideoId_YoutubeUrlIsMalformatted_ThrowsUriFormatException()
            {
                // Act & Assert
                Assert.Throws<NullReferenceException>(() => GetVideoId("blah blah..."));
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
            [TestCase("http://www.youtube.com/watch?v=t-ZRX8984sc", "t-ZRX8984sc")]
            [TestCase("http://youtu.be/t-ZRX8984sc", "t-ZRX8984sc")]
            [TestCase("https://m.youtube.com/iwGFalTRHDA", "iwGFalTRHDA")]
            public void GetVideoId_ProvidedYoutubeUrl_GetCorrectVideoId(string youtubeUrl, string expected)
            {
                // Act
                var videoId = GetVideoId(youtubeUrl);

                // Assert
                Assert.AreEqual(expected, videoId);
            }
        }
    }
}
