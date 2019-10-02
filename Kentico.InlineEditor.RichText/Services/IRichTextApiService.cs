using System.Web.Mvc;
using System.Web.Routing;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    internal interface IRichTextApiService
    {
        void MapEndpointRoute(RouteCollection routeCollection);


        string GetApiEndpointUrl(UrlHelper urlHelper);
    }
}
