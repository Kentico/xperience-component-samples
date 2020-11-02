using CMS.Tests;

using Kentico.Components.Web.Mvc.Selectors.Controllers;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

using NUnit.Framework;
using NSubstitute;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class RouteCollectionExtensionsTests
    {
        [TestFixture]
        public class MapObjectSelectorRoutesTests : UnitTests
        {
            [SetUp]
            public void SetUp()
            {
                EnsureServiceContainer();
            }


            [Test]
            public void MapObjectSelectorRoutesRoutes_NullRouteBuilder_ThrowsArgumentNullException()
            {
                Assert.That(() => ((IEndpointRouteBuilder)null).MapObjectSelectorRoutes(), Throws.ArgumentNullException);
            }

            // TODO KX-54: Make test work or delete
            //[Test]
            //public void MapObjectSelectorRoutesRoutes_RegistersRoutes()
            //{
            //    // Arrange
            //    var routeBuilder = Substitute.For<IEndpointRouteBuilder>();

            //    // Act
            //    routeBuilder.MapObjectSelectorRoutes();

            //    // Assert
            //    routeBuilder.Received(1).MapControllerRoute(
            //        name: ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME,
            //        pattern: ObjectSelectorConstants.GET_OBJECTS_ROUTE,
            //        defaults: new { controller = ObjectSelectorConstants.CONTROLLER_NAME, action = nameof(KenticoObjectSelectorController.GetObjects) });
            //}
        }
    }
}
