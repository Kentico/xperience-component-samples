using System;
using System.Net;

using NSubstitute;
using NUnit.Framework;

using CMS.Base;
using CMS.DataEngine;
using CMS.DocumentEngine;
using CMS.Helpers;
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
            private const string PAGE_PREVIEW_URL_PATH = "/cmsctx/pv/-/home";


            [SetUp]
            public void SetUp()
            {
                pagesRetrieverMock = Substitute.For<IPagesRetriever>();
                richTextGetLinkMetadataActionExecutor = new RichTextGetLinkMetadataActionExecutor(pagesRetrieverMock, "/");

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

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(PAGE_PREVIEW_URL_PATH);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
                    Assert.That(result.StatusCodeMessage, Is.Not.Empty);
                    Assert.That(result.StatusCodeMessage, Is.Not.Null);
                });
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase("/Page/Home")]
            public void ProcessAction_PageUrlPathIsNotValid_ReturnsStatusCodeBadRequest(string pageUrlPath)
            {
                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(pageUrlPath);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                    Assert.That(result.StatusCodeMessage, Is.Not.Empty);
                    Assert.That(result.StatusCodeMessage, Is.Not.Null);
                });
            }


            [Test]
            public void ProcessAction_PageDoesNotExist_ReturnsUnknownLinkType()
            {
                pagesRetrieverMock.GetPage(Arg.Any<string>()).Returns((TreeNode)null);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(PAGE_PREVIEW_URL_PATH);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.Unknown));
                    Assert.That(result.LinkModel.LinkMetadata, Is.Null);
                });
            }


            [Test]
            public void ProcessAction_UserWithInsufficientPermissions_ReturnsStatusCodeUnauthorized()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.CheckPermissions(PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(false);
                pagesRetrieverMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(PAGE_PREVIEW_URL_PATH);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
                    Assert.That(result.StatusCodeMessage, Is.Not.Empty);
                    Assert.That(result.StatusCodeMessage, Is.Not.Null);
                });
            }


            [Test]
            public void ProcessAction_PageExistsAndUserHasPermissions_ReturnsStatusCodeOk()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.DocumentName = "Test";
                pageMock.NodeGUID = Guid.Parse("2ADFE965-BBA3-425C-B834-1551E513E72F");
                pageMock.CheckPermissions(PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(true);

                pagesRetrieverMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = richTextGetLinkMetadataActionExecutor.ProcessAction(PAGE_PREVIEW_URL_PATH);

                Assert.Multiple(() =>
                {
                    Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                    Assert.That(result.LinkModel.LinkType, Is.EqualTo(LinkTypeEnum.Page));
                    Assert.That(result.LinkModel.LinkMetadata.Name, Is.EqualTo(pageMock.DocumentName));
                    Assert.That(result.LinkModel.LinkMetadata.Identifier, Is.EqualTo(pageMock.NodeGUID));
                    Assert.That(result.StatusCodeMessage, Is.Null);
                });
            }
        }
    }
}
