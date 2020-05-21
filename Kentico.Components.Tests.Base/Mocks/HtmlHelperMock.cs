using System.IO;
using System.Web.Mvc;
using System.Web.Routing;

using NSubstitute;

namespace Kentico.Components.Tests.Base
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
        /// <param name="textWriter">Text writer.</param>
        public static HtmlHelper GetHtmlHelper(string applicationPath = "/", RouteData routeData = null, TextWriter textWriter = null)
        {
            return GetHtmlHelper<object>(applicationPath, routeData, textWriter);
        }


        /// <summary>
        /// Gets a mock of a generic HTML helper.
        /// </summary>
        /// <param name="applicationPath">Application path used in HTTP context.</param>
        /// <param name="routeData">Route data.</param>
        /// <param name="textWriter">Text writer.</param>
        public static HtmlHelper<TModel> GetHtmlHelper<TModel>(string applicationPath = "/", RouteData routeData = null, TextWriter textWriter = null)
        {
            textWriter = textWriter ?? Substitute.For<TextWriter>();

            var context = HttpContextMock.GetHttpContext(applicationPath);

            var viewDataDictionary = new ViewDataDictionary();
            var controllerContext = new ControllerContext(context, routeData ?? new RouteData(), Substitute.For<ControllerBase>());

            var viewContext = new ViewContext(controllerContext, Substitute.For<IView>(), viewDataDictionary, new TempDataDictionary(), textWriter);

            var mockViewDataContainer = Substitute.For<IViewDataContainer>();
            mockViewDataContainer.ViewData.Returns(viewDataDictionary);

            return new HtmlHelper<TModel>(viewContext, mockViewDataContainer);
        }
    }
}
