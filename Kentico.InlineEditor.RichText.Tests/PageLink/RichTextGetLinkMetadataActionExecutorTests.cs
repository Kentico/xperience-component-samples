using System;
using System.Net;

using NSubstitute;
using NUnit.Framework;

using CMS.Base;
using CMS.DataEngine;
using CMS.DocumentEngine;
using CMS.Helpers;
using CMS.MediaLibrary;
using CMS.Membership;
using CMS.Tests;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RichTextGetLinkMetadataActionExecutorTests
    {
        [TestFixture]
        public class ProcessActionTests : UnitTests
        {
            private RichTextGetLinkMetadataActionExecutor richTextGetLinkMetadataActionExecutor;
            private IPagesRetriever pagesRetrieverMock;
            private IMediaFilesRetriever mediaFilesRetrieverMock;


            [SetUp]
            public void SetUp()
            {
                pagesRetrieverMock = Substitute.For<IPagesRetriever>();
                mediaFilesRetrieverMock = Substitute.For<IMediaFilesRetriever>();
                richTextGetLinkMetadataActionExecutor = new RichTextGetLinkMetadataActionExecutor(pagesRetrieverMock, mediaFilesRetrieverMock, "/", "site1");

                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, "pv");
                MembershipContext.AuthenticatedUser = Substitute.For<CurrentUserInfo>();
            }


            [TearDown]
            public void TearDown()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, null);
                MembershipContext.AuthenticatedUser = null;
            }


            [Test]
            public void ProcessAction_PreviewLinkNotInitialized_ReturnsStatusCodeForbidden()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, null);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction("/page");

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
                    Assert.That(result.StatusCodeMessage, Is.Not.Empty);
                    Assert.That(result.StatusCodeMessage, Is.Not.Null);
                });
            }


            [TestCase(null)]
            [TestCase("")]
            public void ProcessAction_PageUrlPathIsNotValid_ReturnsStatusCodeBadRequest(string pageUrlPath)
            {
                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(pageUrlPath);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                    Assert.That(result.StatusCodeMessage, Is.Not.Empty);
                    Assert.That(result.StatusCodeMessage, Is.Not.Null);
                    Assert.That(result.LinkModel, Is.Null);
                });
            }


            [TestCase("http://google.com")]
            [TestCase("https://google.com")]
            [TestCase("//google.com")]
            public void ProcessAction_ExternalUrl_ReturnsExternalLinkType(string url)
            {
                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(url);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.External));
                    Assert.That(result.LinkModel.LinkURL, Is.EqualTo(url));
                    Assert.That(result.LinkModel.LinkMetadata, Is.Null);
                });
            }


            [Test]
            public void ProcessAction_LocalUrl_ExistingPage_UserWithInsufficientPermissions_ReturnsStatusCodeUnauthorized()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.CheckPermissions(PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(false);
                pagesRetrieverMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction("/page");

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
                    Assert.That(result.StatusCodeMessage, Is.Not.Empty);
                    Assert.That(result.StatusCodeMessage, Is.Not.Null);
                    Assert.That(result.LinkModel, Is.Null);
                });
            }


            [TestCase("/", "/page", "/page")]
            [TestCase("/", "/cmsctx/pv/-/page", "/page")]
            [TestCase("/appPath", "/appPath/page", "/appPath/page")]
            [TestCase("/appPath", "/appPath/cmsctx/pv/-/page", "/appPath/page")]
            public void ProcessAction_LocalUrl_ExistingPage_ReturnsStatusCodeOk(string applicationPath, string url, string expectedLinkUrl)
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.DocumentName = "Test";
                pageMock.NodeGUID = Guid.Parse("2ADFE965-BBA3-425C-B834-1551E513E72F");
                pageMock.CheckPermissions(PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(true);

                pagesRetrieverMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = new RichTextGetLinkMetadataActionExecutor(pagesRetrieverMock, mediaFilesRetrieverMock, applicationPath, "site1").ProcessAction(url);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.Page));
                    Assert.That(result.LinkModel.LinkURL, Is.EqualTo(expectedLinkUrl));
                    Assert.That(result.LinkModel.LinkMetadata.Name, Is.EqualTo(pageMock.DocumentName));
                    Assert.That(result.LinkModel.LinkMetadata.Identifier, Is.EqualTo(pageMock.NodeGUID));
                    Assert.That(result.StatusCodeMessage, Is.Null);
                });
            }


            [TestCase("/", "/page")]
            [TestCase("/appPath", "/appPath/page")]
            public void ProcessAction_LocalUrl_NotExistingPage_ReturnsLocalLinkType(string applicationPath, string linkUrl)
            {
                pagesRetrieverMock.GetPage(Arg.Any<string>()).Returns((TreeNode)null);

                var result = new RichTextGetLinkMetadataActionExecutor(pagesRetrieverMock, mediaFilesRetrieverMock, applicationPath, "site1").ProcessAction(linkUrl);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.Local));
                    Assert.That(result.LinkModel.LinkMetadata, Is.Null);
                    Assert.That(result.LinkModel.LinkURL, Is.EqualTo(linkUrl));
                });
            }


            [Test]
            public void ProcessAction_MediaFileUrl_ExistingMediaFile_ReturnsCorrectLinkModel()
            {
                const string MEDIA_FILE_GUID = "2f51ad51-a88d-45de-af69-8da11bd861eb";
                const string EXTENSION = ".png";
                var linkUrl = $"/getmedia/{MEDIA_FILE_GUID}/test{EXTENSION}";

                var mediaFileMock = Substitute.For<MediaFileInfo>();
                mediaFileMock.FileName = "Test";
                mediaFileMock.FileGUID = Guid.Parse(MEDIA_FILE_GUID);
                mediaFileMock.FileExtension = EXTENSION;
                mediaFilesRetrieverMock.GetMediaFile(Arg.Any<string>()).Returns(mediaFileMock);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(linkUrl);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.MediaFile));
                    Assert.That(result.LinkModel.LinkMetadata.Name, Is.EqualTo(mediaFileMock.FileName + EXTENSION));
                    Assert.That(result.LinkModel.LinkMetadata.Identifier, Is.EqualTo(mediaFileMock.FileGUID));
                    Assert.That(result.LinkModel.LinkURL, Is.EqualTo(linkUrl));
                });
            }


            [Test]
            public void ProcessAction_MediaFileUrl_NotExistingMediaFile_ReturnsLocalLinkType()
            {
                const string MEDIA_FILE_GUID = "2f51ad51-a88d-45de-af69-8da11bd861eb";
                var linkUrl = $"/getmedia/{MEDIA_FILE_GUID}/test.jpg";

                mediaFilesRetrieverMock.GetMediaFile(Arg.Any<string>()).Returns((MediaFileInfo)null);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(linkUrl);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.Local));
                    Assert.That(result.LinkModel.LinkMetadata, Is.Null);
                    Assert.That(result.LinkModel.LinkURL, Is.EqualTo(linkUrl));
                });
            }
        }
    }
}
