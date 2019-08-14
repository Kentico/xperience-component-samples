using System.Collections;
using System.Web;
using System.Web.Routing;

using NSubstitute;

namespace Kentico.InlineEditor.RichText.Tests
{
    /// <summary>
    /// Provides mock of HTTP context for tests.
    /// </summary>
    public static class HttpContextMock
    {
        /// <summary>
        /// Gets a mock of HTTP context.
        /// </summary>
        /// <param name="appPath">Application base path used in route.</param>
        /// <returns>Mock of HTTP context.</returns>
        public static HttpContextBase GetHttpContext(string appPath = null)
        {
            var mockHttpContext = Substitute.For<HttpContextBase>();

            if (!string.IsNullOrEmpty(appPath))
            {
                mockHttpContext.Request.ApplicationPath.Returns(appPath);
            }

            mockHttpContext.Request.PathInfo.Returns(string.Empty);
            mockHttpContext.Request.RequestContext.Returns(new RequestContext(mockHttpContext, new RouteData()));

            mockHttpContext.Session.Returns((HttpSessionStateBase)null);
            mockHttpContext.Response.ApplyAppPathModifier(Arg.Any<string>()).Returns(r => r[0]);

            // Mock place where registered Kentico features are being stored
            mockHttpContext.Items.Returns(new Hashtable());

            return mockHttpContext;
        }
    }
}
