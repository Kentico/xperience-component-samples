using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;

using Kentico.Components.Web.Mvc.FormComponents;

namespace Kentico.Components.Web.Mvc.Selectors.Internal
{
    public static class HtmlHelperExtensions
    {
        private const string FORM_CONTROL_CLASS_NAME = "ktc-form-control";
        private const string OBJECT_TYPE_ATTRIBUTE = "data-object-type";
        private const string GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE = "data-get-objects-endpoint-url";
        private const string INITIALIZATION_EVENT_NAME_ATTRIBUTE = "data-initialization-event";
        // Name of an attribute that indicates whether the object selector should identify objects by their GUIDs instead of code names.
        private const string IDENTIFY_OBJECTS_BY_GUID_ATTRIBUTE = "data-identify-object-by-guid";


        /// <summary>
        /// HTML helper for object selector.
        /// </summary>
        /// <param name="htmlHelper">HTML helper.</param>
        /// <param name="urlHelper">URL helper.</param>
        /// <param name="id">Element ID.</param>
        /// <param name="authenticateUrl">URL authentication method.</param>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="htmlHelper"/>, <paramref name="urlHelper"/> or <paramref name="authenticateUrl"/> are null.</exception>
        /// <exception cref="ArgumentException">Thrown when <paramref name="id"/> is empty.</exception>
        public static MvcHtmlString ObjectSelector(this HtmlHelper<ObjectSelector> htmlHelper, UrlHelper urlHelper, string id, Func<string, HtmlString> authenticateUrl)
        {
            htmlHelper = htmlHelper ?? throw new ArgumentNullException(nameof(htmlHelper));
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));
            authenticateUrl = authenticateUrl ?? throw new ArgumentNullException(nameof(authenticateUrl));
            if (String.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException("Element ID cannot be empty.", nameof(id));
            }

            var objectSelector = htmlHelper.ViewData.Model;
            var getObjectsEndpointUrl = urlHelper.HttpRouteUrl(ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME, new RouteValueDictionary());
            getObjectsEndpointUrl = authenticateUrl(getObjectsEndpointUrl).ToString();

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
                { IDENTIFY_OBJECTS_BY_GUID_ATTRIBUTE, objectSelector.Properties.IdentifyObjectByGuid }
            });

            return MvcHtmlString.Create(String.Concat(dropDown.ToString(), valueInput.ToString()));
        }
    }
}
