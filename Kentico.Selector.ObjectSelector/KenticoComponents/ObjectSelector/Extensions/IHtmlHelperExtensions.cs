using System;
using System.Collections.Generic;

using Kentico.Components.Web.Mvc.FormComponents;

using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Routing;


namespace Kentico.Components.Web.Mvc.Selectors.Internal
{
    public static class IHtmlHelperExtensions
    {
        internal const string FORM_CONTROL_CLASS_NAME = "ktc-form-control";
        internal const string OBJECT_TYPE_ATTRIBUTE = "data-object-type";
        internal const string GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE = "data-get-objects-endpoint-url";
        internal const string INITIALIZATION_EVENT_NAME_ATTRIBUTE = "data-initialization-event";
        // Name of an attribute that indicates whether the object selector should identify objects by their GUIDs instead of code names.
        internal const string IDENTIFY_OBJECTS_BY_GUID_ATTRIBUTE = "data-identify-object-by-guid";


        /// <summary>
        /// HTML helper for the object selector's value input tag.
        /// </summary>
        /// <param name="htmlHelper">HTML helper.</param>
        /// <param name="id">Element ID.</param>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="htmlHelper"/> is null.</exception>
        /// <exception cref="ArgumentException">Thrown when <paramref name="id"/> is empty.</exception>
        public static IHtmlContent ObjectSelectorValue(this IHtmlHelper<ObjectSelector> htmlHelper, string id)
        {
            htmlHelper = htmlHelper ?? throw new ArgumentNullException(nameof(htmlHelper));

            if (String.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException("Element ID cannot be empty.", nameof(id));
            }

            return htmlHelper.TextBoxFor(m => m.SelectedValue, new
            {
                hidden = "true",
                data_value_for = id
            });
        }


        /// <summary>
        /// HTML helper for object selector drop down.
        /// </summary>
        /// <param name="htmlHelper">HTML helper.</param>
        /// <param name="urlHelper">URL helper.</param>
        /// <param name="id">Element ID.</param>
        /// <param name="authenticateUrl">URL authentication method.</param>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="htmlHelper"/>, <paramref name="urlHelper"/> or <paramref name="authenticateUrl"/> are null.</exception>
        /// <exception cref="ArgumentException">Thrown when <paramref name="id"/> is empty.</exception>
        public static IHtmlContent ObjectSelectorDropDown(this IHtmlHelper<ObjectSelector> htmlHelper, IUrlHelper urlHelper, string id, Func<string, string> authenticateUrl)
        {
            htmlHelper = htmlHelper ?? throw new ArgumentNullException(nameof(htmlHelper));
            urlHelper = urlHelper ?? throw new ArgumentNullException(nameof(urlHelper));
            authenticateUrl = authenticateUrl ?? throw new ArgumentNullException(nameof(authenticateUrl));
            if (String.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException("Element ID cannot be empty.", nameof(id));
            }

            var getObjectsEndpointUrl = urlHelper.RouteUrl(ObjectSelectorConstants.GET_OBJECTS_ROUTE_NAME, new RouteValueDictionary());

            if (String.IsNullOrEmpty(getObjectsEndpointUrl))
            {
                throw new InvalidOperationException("The object selector route was not found. Register the object selector route using the IEndpointRouteBuilder.MapObjectSelectorRoutes() method in your application startup.");
            }

            getObjectsEndpointUrl = authenticateUrl(getObjectsEndpointUrl).ToString();
            var objectSelector = htmlHelper.ViewData.Model;

            return htmlHelper.DropDownListFor(m => m.SelectedValue, objectSelector.SelectedItems, new Dictionary<string, object>
            {
                { "id", id },
                { "class", FORM_CONTROL_CLASS_NAME },
                { OBJECT_TYPE_ATTRIBUTE, objectSelector.Properties.ObjectType },
                { GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE, getObjectsEndpointUrl },
                { INITIALIZATION_EVENT_NAME_ATTRIBUTE, ObjectSelectorConstants.COMPONENT_INITIALIZATION_EVENT_NAME },
                { IDENTIFY_OBJECTS_BY_GUID_ATTRIBUTE, objectSelector.Properties.IdentifyObjectByGuid }
            });
        }
    }
}
