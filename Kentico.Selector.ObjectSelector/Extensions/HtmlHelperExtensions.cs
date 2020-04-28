using System;
using System.Web.Mvc;
using System.Web.Routing;

using Kentico.Content.Web.Mvc;
using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.Selectors
{
    public static class HtmlHelperExtensions
    {
        private const string FORM_CONTROL_CLASS_NAME = "ktc-form-control";
        private const string OBJECT_TYPE_ATTRIBUTE = "data-object-type";
        private const string GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE = "data-get-objects-endpoint-url";
        private const string INITIALIZATION_EVENT_NAME_ATTRIBUTE = "data-initialization-event";


        /// <summary>
        /// HTML helper for object selector.
        /// </summary>
        /// <param name="instance">The object that provides methods to render HTML fragments.</param>
        /// <param name="id">Element ID.</param>
        /// <param name="objectType">Object type.</param>
        /// <exception cref="ArgumentNullException">Thrown when the <paramref name="instance"/> is null.</exception>
        public static MvcHtmlString ObjectSelector(this ExtensionPoint<HtmlHelper> instance, string id, string objectType)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));

            if (String.IsNullOrEmpty(objectType))
            {
                throw new ArgumentException("The parameter cannot be empty.", nameof(objectType));
            }

            var htmlHelper = instance.Target;
            var requestContext = htmlHelper.ViewContext.RequestContext;
            var urlHelper = new UrlHelper(requestContext, htmlHelper.RouteCollection);
            var getObjectsEndpointUrl = urlHelper.HttpRouteUrl(ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME, new RouteValueDictionary());
            getObjectsEndpointUrl = urlHelper.Kentico().AuthenticateUrl(getObjectsEndpointUrl).ToString();

            var tagBuilder = new TagBuilder("select");
            tagBuilder.Attributes.Add("id", id);
            tagBuilder.Attributes.Add(OBJECT_TYPE_ATTRIBUTE, objectType);
            tagBuilder.Attributes.Add(GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE, getObjectsEndpointUrl);
            tagBuilder.Attributes.Add(INITIALIZATION_EVENT_NAME_ATTRIBUTE, ObjectSelectorConstants.COMPONENT_INITIALIZATION_EVENT_NAME);
            tagBuilder.AddCssClass(FORM_CONTROL_CLASS_NAME);

            return new MvcHtmlString(tagBuilder.ToString());
        }
    }
}
