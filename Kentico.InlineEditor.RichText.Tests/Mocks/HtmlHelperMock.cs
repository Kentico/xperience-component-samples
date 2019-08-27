using System.IO;
using System.Web.Mvc;
using System.Web.Routing;

using NSubstitute;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    /// <summary>
    /// Provides mock of HTML helper for tests.
    /// </summary>
    public static class HtmlHelperMock
    {
        /// <summary>
        /// Gets a mock of HTML helper.
        /// </summary>
        /// <param name="applicationPath">Application path used in HTTP context.</param>
        /// <param name="routeData">Route data.</param>
        public static HtmlHelper GetHtmlHelper(string applicationPath = "/", RouteData routeData = null, TextWriter textWriter = null)
        {
            textWriter = textWriter ?? Substitute.For<TextWriter>();

            var context = HttpContextMock.GetHttpContext(applicationPath);

            var viewDataDictionary = new ViewDataDictionary();
            var controllerContext = new ControllerContext(context, routeData ?? new RouteData(), Substitute.For<ControllerBase>());

            var viewContext = new ViewContext(controllerContext, Substitute.For<IView>(), viewDataDictionary, new TempDataDictionary(), textWriter);

            var mockViewDataContainer = Substitute.For<IViewDataContainer>();
            mockViewDataContainer.ViewData.Returns(viewDataDictionary);

            return new HtmlHelper(viewContext, mockViewDataContainer);
        }
    }
}
