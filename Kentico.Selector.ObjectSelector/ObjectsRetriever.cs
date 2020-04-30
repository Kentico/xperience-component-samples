using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using CMS.Base;
using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Kentico.Components.Web.Mvc.Selectors
{
    internal class ObjectsRetriever
    {
        private readonly ISiteService siteService;


        public ObjectsRetriever(ISiteService siteService)
        {
            this.siteService = siteService;
        }


        public ObjectQuery<BaseInfo> GetObjectsQuery(string objectType)
        {
            var typeInfo = GetTypeInfo(objectType);

            return new ObjectQuery<BaseInfo>(objectType)
               .OnSite(siteService.CurrentSite.SiteName, includeGlobal: true)
               .Columns(typeInfo.GUIDColumn, typeInfo.DisplayNameColumn);
        }


        public IEnumerable<SelectListItem> GetObjects(string objectType, IEnumerable<ObjectSelectorItem> selectorItems)
        {
            var typeInfo = GetTypeInfo(objectType);
            if (String.IsNullOrEmpty(typeInfo.GUIDColumn) || typeInfo.GUIDColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal))
            {
                throw new InvalidOperationException($"The object type '{typeInfo.ObjectType}' does not have a GUID column defined. The object selector form component can be used only for objects that have a GUID column specified.");
            }

            var serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                }
            };

            return GetObjectsQuery(objectType)
                .WhereIn(typeInfo.GUIDColumn, selectorItems.Select(i => i.ObjectGuid).ToList())
                .Select(info =>
                {
                    var displayName = (string)info[typeInfo.DisplayNameColumn];
                    var guid = (Guid)info[typeInfo.GUIDColumn];
                    var item = selectorItems.FirstOrDefault(i => i.ObjectGuid == guid);

                    return new SelectListItem
                    {
                        Text = displayName,
                        Value = JsonConvert.SerializeObject(item, serializerSettings),
                        Selected = true,
                    };
                });
        }


        /// <summary>
        /// Returns object type info for the given object type.
        /// </summary>
        /// <param name="objectType">Object type.</param>
        /// <exception cref="InvalidOperationException">Thrown when object type info for the given <paramref name="objectType"/> is not found.</exception>
        public ObjectTypeInfo GetTypeInfo(string objectType)
        {
            return ObjectTypeManager.GetTypeInfo(objectType, exceptionIfNotFound: true);
        }
    }
}
