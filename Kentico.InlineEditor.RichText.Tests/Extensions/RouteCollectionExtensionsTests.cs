using System.Web.Routing;

using CMS.Core;
using CMS.Tests;

using NSubstitute;
using NUnit.Framework;

using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RouteCollectionExtensionsTests
    {
        [TestFixture]
        public class MapRichTextEditorRoutesTests : UnitTests
        {
            private IRichTextApiService richTextApiService;


            [SetUp]
            public void SetUp()
            {
                richTextApiService = Substitute.For<IRichTextApiService>();
                Service.Use<IRichTextApiService>(richTextApiService);
            }


            [Test]
            public void MapRichTextEditorRoutes()
            {
                var routes = new RouteCollection();
                routes.Kentico().MapRichTextEditorRoutes();

                richTextApiService.Received(1).MapEndpointRoute(routes);
            }
        }
    }
}
