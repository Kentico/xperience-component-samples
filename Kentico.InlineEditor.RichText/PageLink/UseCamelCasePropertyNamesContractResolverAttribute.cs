using System;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http.Controllers;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Controller decorated with this attribute uses <see cref="CamelCasePropertyNamesContractResolver"/> to handle JSON serialization.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    internal sealed class UseCamelCasePropertyNamesContractResolverAttribute : Attribute, IControllerConfiguration
    {
        /// <summary>
        /// Initializes controller with <see cref="JsonMediaTypeFormatter"/> to handle JSON formatting.
        /// </summary>
        /// <param name="controllerSettings">The controller settings to initialize.</param>
        /// <param name="controllerDescriptor">The controller descriptor.</param>
        public void Initialize(HttpControllerSettings controllerSettings, HttpControllerDescriptor controllerDescriptor)
        {
            var formatters = controllerSettings.Formatters;

            foreach (var jsonFormatter in formatters.OfType<JsonMediaTypeFormatter>().ToArray())
            {
                var newFormatter = new JsonMediaTypeFormatter
                {
                    SerializerSettings = new JsonSerializerSettings
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    }
                };

                var jsonFormatterIndex = formatters.IndexOf(jsonFormatter);
                formatters[jsonFormatterIndex] = newFormatter;
            }
        }
    }
}
