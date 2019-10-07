using System;
using System.Net;

using NSubstitute;
using NUnit.Framework;

using CMS.Base;
using CMS.Core;
using CMS.DataEngine;
using CMS.DocumentEngine;
using CMS.Helpers;
using CMS.Membership;
using CMS.Tests;

using Kentico.Components.Web.Mvc.InlineEditors.Internal;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RichTextActionsHandlerTests
    {
        [TestFixture]
        public class HandleGetPageActionTests : UnitTests
        {
            private IRichTextApiService richTextApiServiceMock;
            private dynamic responseData;


            [SetUp]
            public void SetUp()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, "test");
                MembershipContext.AuthenticatedUser = Substitute.For<CurrentUserInfo>();

                richTextApiServiceMock = Substitute.For<IRichTextApiService>();
                Service.Use<IRichTextApiService>(richTextApiServiceMock);

                responseData = null;
            }


            [Test]
            public void HandleGetPageAction_PreviewLinkNotInitialized_ReturnsStatusCodeForbidden()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, null);

                var result = new RichTextActionsHandler().HandleGetPageAction("pageUrl", ref responseData);

                Assert.That(result, Is.EqualTo(HttpStatusCode.Forbidden));
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            [TestCase("/Page/Home")]
            public void HandleGetPageAction_PageUrlIsNotValid_ReturnsStatusCodeBadRequest(string pageUrl)
            {
                var result = new RichTextActionsHandler().HandleGetPageAction(pageUrl, ref responseData);

                Assert.That(result, Is.EqualTo(HttpStatusCode.BadRequest));
            }


            [Test]
            public void HandleGetPageAction_PageDoesNotExist_ReturnsStatusCodeNotFound()
            {
                richTextApiServiceMock.GetPage(Arg.Any<string>()).Returns((callInfo) => null);

                var result = new RichTextActionsHandler().HandleGetPageAction("/-/Page/Test", ref responseData);

                Assert.That(result, Is.EqualTo(HttpStatusCode.NotFound));
            }


            [Test]
            public void HandleGetPageAction_UserWithInsufficientPermissions_ReturnsStatusCodeUnauthorized()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.CheckPermissions(PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(false);
                richTextApiServiceMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = new RichTextActionsHandler().HandleGetPageAction("/-/Page/Test", ref responseData);

                Assert.That(result, Is.EqualTo(HttpStatusCode.Unauthorized));
            }


            [Test]
            public void HandleGetPageAction_PageExistsAndUserHasPermissions_ReturnsStatusCodeOk()
            {
                var pageMock = Substitute.For<TreeNode>();
                pageMock.DocumentName = "Test";
                pageMock.NodeGUID = Guid.Parse("2ADFE965-BBA3-425C-B834-1551E513E72F");
                pageMock.CheckPermissions(PermissionsEnum.Read, Arg.Any<string>(), Arg.Any<IUserInfo>()).Returns(true);
                richTextApiServiceMock.GetPage(Arg.Any<string>()).Returns(pageMock);

                var result = new RichTextActionsHandler().HandleGetPageAction("/-/Page/Test", ref responseData);

                Assert.That(result, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(responseData.name, Is.EqualTo(pageMock.DocumentName));
                Assert.That(responseData.nodeGuid, Is.EqualTo(pageMock.NodeGUID));
            }
        }
    }
}
