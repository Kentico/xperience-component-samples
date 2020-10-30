using System;
using System.Text.RegularExpressions;

// using Kentico.Components.Web.Mvc.Widgets.Models;

using NUnit.Framework;


namespace Kentico.Components.Web.Mvc.Widgets.Helpers.Tests
{
    public static class VideoHelperTests
    {
        [TestFixture]
        public class GetVideoModelTests
        {
            [Test]
            public void Magic_TrueEqualsTrue()
            {
                // Act & Assert
                Assert.AreEqual(true, false);
            }


            //[Test]
            //public void GetVideoModel_VideoUrlIsMalformed_ThrowsUriFormatException()
            //{
            //    // Act & Assert
            //    Assert.Throws<UriFormatException>(() => VideoHelper.GetVideoModel("blah blah..."));
            //}


            //[Test]
            //public void GetVideoModel_VideoUrlIsNull_RetursEmptyModel()
            //{
            //    // Act
            //    var model = VideoHelper.GetVideoModel(null);

            //    // Assert
            //    Assert.Multiple(() => {
            //        Assert.IsNull(model.VideoId);
            //        Assert.IsNull(model.VideoUrl);
            //        Assert.AreEqual(VideoKindEnum.Unknown, model.VideoKind);
            //    });
            //}


            //[TestCase("http://youtube.com/watch?v=iwGFalTRHDA", "iwGFalTRHDA", VideoKindEnum.Youtube)]
            //[TestCase("http://www.youtube.com/watch?v=iwGFalTRHDA&feature=related", "iwGFalTRHDA", VideoKindEnum.Youtube)]
            //[TestCase("https://youtube.com/iwGFalTRHDA", "iwGFalTRHDA", VideoKindEnum.Youtube)]
            //[TestCase("http://youtu.be/n17B_uFF4cA", "n17B_uFF4cA", VideoKindEnum.Youtube)]
            //[TestCase("youtube.com/iwGFalTRHDA", "iwGFalTRHDA", VideoKindEnum.Youtube)]
            //[TestCase("youtube.com/n17B_uFF4cA", "n17B_uFF4cA", VideoKindEnum.Youtube)]
            //[TestCase("m.youtube.com/iwGFalTRHDA", "iwGFalTRHDA", VideoKindEnum.Youtube)]
            //[TestCase("m.youtube.com/n17B_uFF4cA", "n17B_uFF4cA", VideoKindEnum.Youtube)]
            //[TestCase("http://www.youtube.com/embed/watch?feature=player_embedded&v=r5nB9u4jjy4", "r5nB9u4jjy4", VideoKindEnum.Youtube)]
            //[TestCase("https://www.youtube.com/embed/lkazf4nMYwU", "lkazf4nMYwU", VideoKindEnum.Youtube)]
            //[TestCase("http://www.youtube.com/watch?v=t-ZRX8984sc", "t-ZRX8984sc", VideoKindEnum.Youtube)]
            //[TestCase("http://youtu.be/t-ZRX8984sc", "t-ZRX8984sc", VideoKindEnum.Youtube)]
            //[TestCase("https://m.youtube.com/iwGFalTRHDA", "iwGFalTRHDA", VideoKindEnum.Youtube)]
            //[TestCase("https://vimeo.com/62092214", "62092214", VideoKindEnum.Vimeo)]
            //[TestCase("http://vimeo.com/62092214", "62092214", VideoKindEnum.Vimeo)]
            //[TestCase("https://www.vimeo.com/62092214", "62092214", VideoKindEnum.Vimeo)]
            //[TestCase("https://vimeo.com/channels/documentaryfilm/128373915", "128373915", VideoKindEnum.Vimeo)]
            //[TestCase("https://vimeo.com/groups/musicvideo/videos/126199390", "126199390", VideoKindEnum.Vimeo)]
            //[TestCase("https://vimeo.com/showcase/123456/video/126199390", "126199390", VideoKindEnum.Vimeo)]
            //[TestCase("https://vimeo.com/62092214?query=foo", "62092214", VideoKindEnum.Vimeo)]
            //public void GetVideoModel_ProvidedYoutubeOrVimeoUrl_GetCorrectVideoModel(string videoUrl, string expectedVideoId, VideoKindEnum expectedVideoKind)
            //{
            //    var actualModel = VideoHelper.GetVideoModel(videoUrl);

            //    Assert.That(actualModel, Is.Not.Null);
            //    Assert.Multiple(() =>
            //    {
            //        Assert.That(actualModel.VideoUrl, Is.EqualTo(videoUrl));
            //        Assert.That(actualModel.VideoId, Is.EqualTo(expectedVideoId));
            //        Assert.That(actualModel.VideoKind, Is.EqualTo(expectedVideoKind));
            //    });
            //}
        }


        //[TestFixture]
        //public class GetVideoEmbedUrlTests
        //{
        //    [Test]
        //    public void GetVideoEmbedUrl_VideoParameterIsNull_ThrowsArgumentNullException()
        //    {
        //        Assert.That(() => VideoHelper.GetVideoEmbedUrl(null), Throws.ArgumentNullException.With.Property("ParamName").EqualTo("video"));
        //    }

        //    [Test]
        //    public void GetVideoEmbedUrl_VideoIsNotSupported_ThrowsNotSupportedException()
        //    {
        //        var model = new VideoModel("foo", "bar", VideoKindEnum.Unknown);
        //        Assert.Throws<NotSupportedException>(() => VideoHelper.GetVideoEmbedUrl(model));
        //    }


        //    [TestCase(VideoKindEnum.Youtube, VideoHelper.YOUTUBE_VIDEO_URL_EMBED_FORMAT)]
        //    [TestCase(VideoKindEnum.Vimeo, VideoHelper.VIMEO_VIDEO_URL_EMBED_FORMAT)]
        //    public void GetVideoEmbedUrl_ProvidedVariousVideoKinds_GetCorrectVideoFormat(VideoKindEnum kind, string embedUrlPrefix)
        //    {
        //        var model = new VideoModel("foo", "123456", kind);
        //        string actualEmbedUrl = VideoHelper.GetVideoEmbedUrl(model);

        //        Assert.That(actualEmbedUrl, Does.StartWith(embedUrlPrefix));
        //    }
        //}


        //[TestFixture]
        //public class RegexVideoUrlTests
        //{
        //    private readonly Regex regex = new Regex(VideoHelper.REGEX_VIDEO_URL);


        //    [TestCase("http://youtube.com", false)]
        //    [TestCase("http://youtube.com/", false)]
        //    [TestCase("http://youtube.com/abc", true)]
        //    [TestCase("http://youtube.com/watch?v=iwGFalTRHDA", true)]
        //    [TestCase("http://www.youtube.com/watch?v=iwGFalTRHDA&feature=related", true)]
        //    [TestCase("https://youtube.com/iwGFalTRHDA", true)]
        //    [TestCase("http://youtu.be/n17B_uFF4cA", true)]
        //    [TestCase("youtube.com/iwGFalTRHDA", true)]
        //    [TestCase("m.youtube.com/iwGFalTRHDA", true)]
        //    [TestCase("m.youtube.com/n17B_uFF4cA", true)]
        //    [TestCase("https://m.youtube.com/iwGFalTRHDA", true)]
        //    [TestCase("http://www.youtube.com/embed/watch?feature=player_embedded&v=r5nB9u4jjy4", true)]
        //    [TestCase("http://www.youtube.com/watch?v=t-ZRX8984sc", true)]
        //    [TestCase("http://youtu.ce/t-ZRX8984sc", false)]
        //    [TestCase("https://vimeo.com/62092214", true)]
        //    [TestCase("http://vimeo.com/62092214", true)]
        //    [TestCase("https://www.vimeo.com/62092214", true)]
        //    [TestCase("https://vimeo.com/channels/documentaryfilm/128373915", true)]
        //    [TestCase("https://vimeo.com/groups/musicvideo/videos/126199390", true)]
        //    [TestCase("https://vimeo.com/62092214?query=foo", true)]
        //    [TestCase("http://vimeo/62092214", false)]
        //    [TestCase("http://vimeo.com/foo", false)]
        //    [TestCase("https://vimeo.com/channels/foo-barr/documentaryfilm/128373915", false)]
        //    [TestCase("http://vimeo.com/groups/musicvideo/vid/126199390", false)]
        //    [TestCase("https://vimeo.com.omomom/62092214?query=foo", false)]
        //    [TestCase("https://vimeo.com/showcase/123456/video/62092214", true)]
        //    [TestCase("https://vimeo.com/showcase/123456/video/62092214?foo=bar", true)]
        //    [TestCase("https://vimeo.com/showcase/foo/123456/video/62092214", false)]
        //    [TestCase("https://vimeo.com/foo/showcase/123456/video/62092214", false)]
        //    [TestCase("https://vimeo.com/showcase/123456/video/foo/62092214", false)]
        //    public void RegexVideoUrl_AllPossibleVideoUrls_ReturnsCorrectResult(string url, bool isValidVideoUrl)
        //    {
        //        // Act & Assert
        //        Assert.That(regex.IsMatch(url), Is.EqualTo(isValidVideoUrl));
        //    }
        //}
    }
}
