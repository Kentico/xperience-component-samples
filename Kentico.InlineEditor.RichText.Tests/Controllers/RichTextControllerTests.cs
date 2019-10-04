using System;
using System.Net;
using System.Web.Http.Results;

using CMS.Base;
using CMS.Core;
using CMS.DocumentEngine;
using CMS.Helpers;
using CMS.Membership;
using CMS.Tests;

using NSubstitute;
using NUnit.Framework;

using Kentico.Components.Web.Mvc.InlineEditors.Controllers;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RichTextControllerTests
    {
        [TestFixture]
        public class GetPageTests : UnitTests
        {
            private IRichTextApiService richTextApiServiceMock;


            [SetUp]
            public void SetUp()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, "test");
                MembershipContext.AuthenticatedUser = Substitute.For<CurrentUserInfo>();

                richTextApiServiceMock = Substitute.For<IRichTextApiService>();
                Service.Use<IRichTextApiService>(richTextApiServiceMock);
            }


            [Test]
            public void GetPage_PreviewLinkNotInitialized_ReturnsForbiddenResult()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, null);

                var result = new RichTextController().GetPage("pageUrl");

                Assert.That(result, Is.TypeOf<StatusCodeResult>());
                Assert.That((result as StatusCodeResult).StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            [TestCase("/Page/Home")]
            public void GetPage_PageUrlIsNotValid_ReturnsBadRequestResult(string pageUrl)
            {
                var result = new RichTextController().GetPage(pageUrl);

                Assert.That(result, Is.TypeOf<BadRequestErrorMessageResult>());
            }


            [Test]
            public void GetPage_PageDoesNotExist_ReturnsNotFoundResult()
            {
                richTextApiServiceMock.GetPage(Arg.Any<string>()).Returns((callInfo) => null);

                var result = new RichTextController().GetPage("/-/Page/Test") as StatusCodeResult;

                Assert.That(result, Is.Not.Null);
                Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
            }


            [Test]
            public void GetPage_UserWithInsufficientPermissions_ReturnsUnauthorizedResult()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.CheckPermissions(CMS.DataEngine.PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(false);
                richTextApiServiceMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = new RichTextController().GetPage("/-/Page/Test") as StatusCodeResult;

                Assert.That(result, Is.Not.Null);
                Assert.That(result.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));
            }


            [Test]
            public void GetPage_PageExistsAndUserHasPermissions_ReturnsOkResult()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.DocumentName = "Test";
                pageMock.NodeGUID = Guid.Parse("2ADFE965-BBA3-425C-B834-1551E513E72F");
                pageMock.CheckPermissions(CMS.DataEngine.PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(true);

                richTextApiServiceMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = new RichTextController().GetPage("/-/Page/Test") as OkNegotiatedContentResult<dynamic>;

                Assert.That(result, Is.Not.Null);
                Assert.That(result.Content.name, Is.EqualTo(pageMock.DocumentName));
                Assert.That(result.Content.nodeGuid, Is.EqualTo(pageMock.NodeGUID));
            }
        }
    }
}
