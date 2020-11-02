//using System.Web.Routing;

//namespace Kentico.Components.Tests.Base
//{
//    /// <summary>
//    /// Provides mock of <see cref="RequestContext"/> for tests.
//    /// </summary>
//    public class RequestContextMock
//    {
//        /// <summary>
//        /// Gets a mock of <see cref="RequestContext"/>.
//        /// </summary>
//        /// <param name="applicationPath">Application path used in context.</param>
//        /// <param name="routeData">Route data.</param>
//        public static RequestContext GetRequestContext(string applicationPath = "/", RouteData routeData = null)
//        {
//            var httpContext = HttpContextMock.GetHttpContext(applicationPath);

//            return new RequestContext(httpContext, routeData ?? new RouteData());
//        }
//    }
//}
