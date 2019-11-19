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
    public static class KenticoRichTextControllerTests
    {
        [TestFixture]
        public class GetLinkMetadata : UnitTests
        {
            private KenticoRichTextController richTextController;
            private IRichTextGetLinkMetadataActionExecutor getLinkMetadataMockAction;
            private IEventLogService eventLogService;


            [SetUp]
            public void SetUp()
            {
                getLinkMetadataMockAction = Substitute.For<IRichTextGetLinkMetadataActionExecutor>();
                eventLogService = Substitute.For<IEventLogService>();

                richTextController = new KenticoRichTextController(getLinkMetadataMockAction, eventLogService);
            }


            [TestCase(HttpStatusCode.OK)]
            public void GetLinkMetadata_PageIsFound_ReturnsStatusCodeAndPageModel(HttpStatusCode statusCode)
            {
                // Arrange
                var pageModel = new LinkModel
                {
                    LinkType = LinkTypeEnum.Page
                };

                getLinkMetadataMockAction.ProcessAction(Arg.Any<string>()).Returns(new GetLinkMetadataActionResult(statusCode, linkModel: pageModel));

                // Act
                var result = richTextController.GetLinkMetadata("pageUrlPath");

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.TypeOf<OkNegotiatedContentResult<LinkModel>>());
                    Assert.That((result as OkNegotiatedContentResult<LinkModel>).Content, Is.EqualTo(pageModel));
                });
            }


            [TestCase(HttpStatusCode.NotFound, "message")]
            public void GetLinkMetadata_PageIsNotFound_ReturnsStatusCodeAndPageModel(HttpStatusCode statusCode, string statusCodeMessage)
            {
                // Arrange
                getLinkMetadataMockAction.ProcessAction(Arg.Any<string>()).Returns(new GetLinkMetadataActionResult(statusCode, statusCodeMessage: statusCodeMessage));

                // Act
                var result = richTextController.GetLinkMetadata("pageUrlPath");

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.TypeOf<StatusCodeResult>());
                    Assert.That((result as StatusCodeResult).StatusCode, Is.EqualTo(statusCode));
                    eventLogService.Received().LogEvent(EventType.ERROR, nameof(KenticoRichTextController), nameof(KenticoRichTextController.GetLinkMetadata), statusCodeMessage);
                });
            }
        }
    }
}
