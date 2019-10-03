using System.Web.Routing;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class RichTextApiServiceTests
    {
        [TestFixture]
        public class MapEndpointRouteTests
        {
            [Test]
            public void MapEndpointRoute_RouteIsRegistered()
            {
                var service = new RichTextApiService();
                var routes = new RouteCollection();

                service.MapEndpointRoute(routes);

                Assert.That(routes.Count, Is.EqualTo(1));
                Assert.That((routes[0] as Route).Url, Is.EqualTo("KenticoComponent/Kentico.InlineEditor.RichText/GetPage"));
            }
        }
    }
}
