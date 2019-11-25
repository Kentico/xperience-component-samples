using System.Web.Routing;

using NUnit.Framework;

using CMS.Tests;

using Kentico.Web.Mvc;
using Kentico.Components.Web.Mvc.InlineEditors.Controllers;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public static class RouteCollectionExtensionsTests
    {
        [TestFixture]
        public class MapRichTextEditorRoutesTests : UnitTests
        {
            [Test]
            public void MapRichTextInlineEditorRoutes_RegisteresRoutes()
            {
                // Act
                var routes = new RouteCollection();
                routes.Kentico().MapRichTextInlineEditorRoutes();

                // Assert
                var route = routes[RichTextInlineEditorConstants.GET_LINK_METADATA_ROUTE_NAME] as Route;
                Assert.Multiple(() =>
                {
                    Assert.That(route.Url, Is.EqualTo(RichTextInlineEditorConstants.GET_PAGE_ROUTE_TEMPLATE));
                    Assert.That(route.Defaults["controller"], Is.EqualTo(RichTextInlineEditorConstants.CONTROLLER_NAME));
                    Assert.That(route.Defaults["action"], Is.EqualTo(nameof(KenticoRichTextController.GetLinkMetadata)));
                });
            }
        }
    }
}
