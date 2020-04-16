using System.Linq;
using System.Threading;
using System.Web.Mvc;
using System.Web.Routing;

using CMS.Tests;

using Kentico.Components.Web.Mvc.InlineEditors;
using Kentico.PageBuilder.Web.Mvc;
using Kentico.Web.Mvc;

using NSubstitute;
using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Widgets.Tests
{
    public class RichTextWidgetUrlRetrieverTests
    {
        [TestFixture]
        [Category.Unit]
        public class GetLinkMetadataEndpointUrlTests
        {
            [Test]
            public void GetLinkMetadataEndpointUrl_UrlHelperIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => new RichTextWidgetUrlRetriever().GetLinkMetadataEndpointUrl(null), Throws.ArgumentNullException.With.Property("ParamName").EqualTo("urlHelper"));
            }


            [Test]
            public void GetLinkMetadataEndpointUrl_ReturnsCorrectUrl()
            {
                const string URL = "endpointUrl";

                var urlHelperMock = Substitute.For<UrlHelper>();
                urlHelperMock.Action("GetLinkMetadata",
                                     Arg.Is<RouteValueDictionary>( x =>
                                        // Math only if the route collection contains the two required keys
                                        x["cultureCode"].Equals(Thread.CurrentThread.CurrentCulture.Name)
                                        && x["typeIdentifier"].Equals(KenticoRichTextWidgetController.IDENTIFIER)
                                    ))
                             .Returns(URL);
                             
                Assert.That(() => new RichTextWidgetUrlRetriever().GetLinkMetadataEndpointUrl(urlHelperMock), Is.EqualTo(URL));
            }


            [Test]
            public void GetLinkMetadataEndpointUrl_SystemWidgetRouteIsRegistered()
            {
                // Enable page builder routes registration
                var appBuilderMock = Substitute.For<IApplicationBuilder>();
                appBuilderMock.UsePageBuilder();

                // Register Kentico routes
                var routes = new RouteCollection();
                routes.Kentico().MapRoutes();

                Assert.That(routes.Cast<Route>().First(r => r.Url == "Kentico.PageBuilder/Widgets/{" + RichTextWidgetUrlRetriever.CULTURE_ROUTE_KEY + "}/{" + RichTextWidgetUrlRetriever.TYPE_IDENTIFIER_ROUTE_KEY + "}/{action}"),
                            Is.Not.Null);
            }
        }
    }
}
