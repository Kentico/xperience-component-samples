using System.Web.Routing;

using CMS.Core;

using NSubstitute;
using NUnit.Framework;

using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RouteCollectionExtensionsTests
    {
        [TestFixture]
        public class MapRichTextEditorRoutesTests
        {
            [Test]
            public void MapRichTextEditorRoutes()
            {
                var richTextApiServiceMock = Substitute.For<IRichTextApiService>();
                Service.Use<IRichTextApiService>(richTextApiServiceMock);

                var routes = new RouteCollection();
                routes.Kentico().MapRichTextEditorRoutes();

                richTextApiServiceMock.Received(1).MapEndpointRoute(routes);
            }
        }
    }
}
