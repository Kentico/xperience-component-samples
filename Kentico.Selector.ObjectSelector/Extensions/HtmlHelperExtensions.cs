using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;

using Kentico.Components.Web.Mvc.FormComponents;
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
        /// <param name="htmlHelper">HTML helper.</param>
        /// <param name="id">Element ID.</param>
        /// <exception cref="ArgumentNullException">Thrown when the <paramref name="htmlHelper"/> is null.</exception>
        public static MvcHtmlString ObjectSelector(this HtmlHelper<ObjectSelector> htmlHelper, string id)
        {
            htmlHelper = htmlHelper ?? throw new ArgumentNullException(nameof(htmlHelper));

            var objectSelector = htmlHelper.ViewData.Model;
            var requestContext = htmlHelper.ViewContext.RequestContext;
            var urlHelper = new UrlHelper(requestContext, htmlHelper.RouteCollection);
            var getObjectsEndpointUrl = urlHelper.HttpRouteUrl(ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME, new RouteValueDictionary());
            getObjectsEndpointUrl = urlHelper.Kentico().AuthenticateUrl(getObjectsEndpointUrl).ToString();

            var valueInput = htmlHelper.TextBoxFor(m => m.SelectedValue, new
            {
                hidden = "true",
                data_value_for = id
            });

            var dropDown = htmlHelper.DropDownListFor(m => m.SelectedValue, objectSelector.SelectedItems, new Dictionary<string, object>
            {
                { "id", id },
                { "class", FORM_CONTROL_CLASS_NAME },
                { OBJECT_TYPE_ATTRIBUTE, objectSelector.Properties.ObjectType },
                { GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE, getObjectsEndpointUrl },
                { INITIALIZATION_EVENT_NAME_ATTRIBUTE, ObjectSelectorConstants.COMPONENT_INITIALIZATION_EVENT_NAME },
                { ObjectSelectorConstants.IDENTIFY_OBJECTS_BY_GUID_NAME, objectSelector.Properties.IdentifyObjectByGuid }
            });

            return MvcHtmlString.Create(String.Concat(dropDown.ToString(), valueInput.ToString()));
        }
    }
}
