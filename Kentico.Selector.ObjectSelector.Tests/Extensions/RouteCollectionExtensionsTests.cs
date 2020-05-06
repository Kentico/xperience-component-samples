using System.Web.Routing;

using CMS.Tests;

using Kentico.Components.Web.Mvc.Selectors.Controllers;
using Kentico.Web.Mvc;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class RouteCollectionExtensionsTests
    {
        [TestFixture]
        public class MapObjectSelectorRoutesTests : UnitTests
        {
            [Test]
            public void MapObjectSelectorRoutesRoutes_RegistersRoutes()
            {
                // Act
                var routes = new RouteCollection();
                routes.Kentico().MapObjectSelectorRoutes();

                // Assert
                var route = routes[ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME] as Route;
                Assert.Multiple(() =>
                {
                    Assert.That(route.Url, Is.EqualTo(ObjectSelectorConstants.GET_OBJECTS_ROUTE));
                    Assert.That(route.Defaults["controller"], Is.EqualTo(ObjectSelectorConstants.CONTROLLER_NAME));
                    Assert.That(route.Defaults["action"], Is.EqualTo(nameof(KenticoObjectSelectorController.GetObjects)));
                });
            }
        }
    }
}
