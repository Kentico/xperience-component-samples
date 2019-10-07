using System.Net;
using System.Web.Http.Results;

using NSubstitute;
using NUnit.Framework;

using CMS.Tests;

using Kentico.Components.Web.Mvc.InlineEditors.Controllers;
using Kentico.Components.Web.Mvc.InlineEditors.Internal;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RichTextControllerTests
    {
        [TestFixture]
        public class GetPageTests : UnitTests
        {
            private RichTextController richTextController;
            private IRichTextActionsHandler actionsHandlerMock;


            [SetUp]
            public void SetUp()
            {
                actionsHandlerMock = Substitute.For<IRichTextActionsHandler>();
                richTextController = new RichTextController(actionsHandlerMock);
            }


            [TestCase(HttpStatusCode.NotFound)]
            [TestCase(HttpStatusCode.Forbidden)]
            [TestCase(HttpStatusCode.Unauthorized)]
            public void GetPage_ActionsHandlerReturnsStatusCode_ReturnsStatusCodeResult(HttpStatusCode statusCode)
            {
                actionsHandlerMock.HandleGetPageAction(Arg.Any<string>(), ref Arg.Any<object>()).Returns(statusCode);

                var result = richTextController.GetPage("/-/Page/Test");

                Assert.That(result, Is.TypeOf<StatusCodeResult>());
                Assert.That((result as StatusCodeResult).StatusCode, Is.EqualTo(statusCode));
            }


            [Test]
            public void GetPage_ActionsHandlerReturnsStatusCodeBadRequest_ReturnsBadRequestResult()
            {
                actionsHandlerMock.HandleGetPageAction(Arg.Any<string>(), ref Arg.Any<object>()).Returns(HttpStatusCode.BadRequest);

                var result = richTextController.GetPage("/-/Page/Test");

                Assert.That(result, Is.TypeOf<BadRequestErrorMessageResult>());
            }


            [Test]
            public void GetPage_ActionsHandlerReturnsStatusCodeOk_ReturnsOkResult()
            {
                dynamic responseDataMock = new { name = "Home", nodeGuid = "GUID" };
                actionsHandlerMock.HandleGetPageAction(Arg.Any<string>(), ref Arg.Any<object>()).Returns(parameters =>
                {
                    parameters[1] = responseDataMock;
                    return HttpStatusCode.OK;
                });

                var result = richTextController.GetPage("/-/Page/Test") as OkNegotiatedContentResult<dynamic>;

                Assert.That(result, Is.Not.Null);
                Assert.That(result.Content.name, Is.EqualTo(responseDataMock.name));
                Assert.That(result.Content.nodeGuid, Is.EqualTo(responseDataMock.nodeGuid));
            }
        }
    }
}
