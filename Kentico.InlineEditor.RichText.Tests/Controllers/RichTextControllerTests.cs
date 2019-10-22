using System;
using System.Net;
using System.Web.Http.Results;

using NSubstitute;
using NUnit.Framework;

using CMS.Core;
using CMS.EventLog;
using CMS.Tests;

using Kentico.Components.Web.Mvc.InlineEditors.Controllers;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RichTextControllerTests
    {
        [TestFixture]
        public class GetPageTests : UnitTests
        {
            private RichTextController richTextController;
            private IRichTextGetPageActionExecutor getPageMockAction;
            private IEventLogService eventLogService;


            [SetUp]
            public void SetUp()
            {
                getPageMockAction = Substitute.For<IRichTextGetPageActionExecutor>();
                eventLogService = Substitute.For<IEventLogService>();

                richTextController = new RichTextController(getPageMockAction, eventLogService);
            }


            [TestCase(HttpStatusCode.OK)]
            public void GetPage_PageIsFound_ReturnsStatusCodeAndPageModel(HttpStatusCode statusCode)
            {
                // Arrange
                var pageModel = new PageLinkModel
                {
                    Name = "pageName",
                    NodeGuid = Guid.Empty
                };

                getPageMockAction.ProcessAction(Arg.Any<string>()).Returns(new GetPageActionResult(statusCode, page: pageModel));

                // Act
                var result = richTextController.GetPage("pageUrlPath");

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.TypeOf<OkNegotiatedContentResult<PageLinkModel>>());
                    Assert.That((result as OkNegotiatedContentResult<PageLinkModel>).Content, Is.EqualTo(pageModel));
                });
            }


            [TestCase(HttpStatusCode.NotFound, "message")]
            public void GetPage_PageIsNotFound_ReturnsStatusCodeAndPageModel(HttpStatusCode statusCode, string statusCodeMessage)
            {
                // Arrange
                getPageMockAction.ProcessAction(Arg.Any<string>()).Returns(new GetPageActionResult(statusCode, statusCodeMessage: statusCodeMessage));

                // Act
                var result = richTextController.GetPage("pageUrlPath");

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.TypeOf<StatusCodeResult>());
                    Assert.That((result as StatusCodeResult).StatusCode, Is.EqualTo(statusCode));
                    eventLogService.Received().LogEvent(EventType.ERROR, nameof(RichTextController), nameof(RichTextController.GetPage), statusCodeMessage);
                });
            }
        }
    }
}
