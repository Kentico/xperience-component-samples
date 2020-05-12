﻿using System.Web.Mvc;
using System.Web.Routing;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class FakeUrlHelper : UrlHelper
    {
        private string url;


        public FakeUrlHelper(string url)
        {
            this.url = url;
        }


        public override string HttpRouteUrl(string routeName, RouteValueDictionary routeValues)
        {
            return url;
        }
    }
}
