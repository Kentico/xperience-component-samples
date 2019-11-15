using System;
using System.Net;
using System.Web.Mvc;

using NSubstitute;
using NUnit.Framework;

using CMS.Core;
using CMS.EventLog;
using CMS.Tests;

using Kentico.Components.Web.Mvc.Widgets.Controllers;
using Kentico.Components.Web.Mvc.InlineEditors;

namespace Kentico.Components.Web.Mvc.Widgets.Tests
{
    public class RichTextWidgetControllerTests
    {
        [TestFixture]
        public class GetLinkMetadataTests : UnitTests
        {
            private RichTextWidgetController richTextController;
            private IRichTextGetLinkMetadataActionExecutor getLinkMetadataActionMock;
            private IEventLogService eventLogService;


            [SetUp]
            public void SetUp()
            {
                getLinkMetadataActionMock = Substitute.For<IRichTextGetLinkMetadataActionExecutor>();
                eventLogService = Substitute.For<IEventLogService>();

                richTextController = new RichTextWidgetController(getLinkMetadataActionMock, eventLogService);
            }


            [TestCase(HttpStatusCode.OK)]
            public void GetLinkMetadata_PageIsFound_ReturnsStatusCodeAndPageModel(HttpStatusCode statusCode)
            {
                // Arrange
                var pageModel = new LinkModel
                {
                    LinkType = LinkTypeEnum.Page
                };

                getLinkMetadataActionMock.ProcessAction(Arg.Any<string>()).Returns(new GetLinkMetadataActionResult(statusCode, linkModel: pageModel));

                // Act
                var result = richTextController.GetLinkMetadata("pageUrlPath");

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.TypeOf<JsonCamelCaseResult>());
                    Assert.That((result as JsonCamelCaseResult).Data, Is.EqualTo(pageModel));
                });
            }


            [TestCase(HttpStatusCode.NotFound, "message")]
            public void GetLinkMetadata_PageIsNotFound_ReturnsStatusCodeAndPageModel(HttpStatusCode statusCode, string statusCodeMessage)
            {
                // Arrange
                getLinkMetadataActionMock.ProcessAction(Arg.Any<string>()).Returns(new GetLinkMetadataActionResult(statusCode, statusCodeMessage: statusCodeMessage));

                // Act
                var result = richTextController.GetLinkMetadata("pageUrlPath");

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.TypeOf<HttpStatusCodeResult>());
                    Assert.That((result as HttpStatusCodeResult).StatusCode, Is.EqualTo((int)statusCode));
                    eventLogService.Received().LogEvent(EventType.ERROR, nameof(RichTextWidgetController), nameof(RichTextWidgetController.GetLinkMetadata), statusCodeMessage);
                });
            }
        }
    }
}
