using System;
using System.Collections.Generic;
using System.Linq;

using CMS.Base;
using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;

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

            var query = new ObjectQuery<BaseInfo>(objectType)
               .OnSite(siteService.CurrentSite.SiteName, includeGlobal: true)
               .Columns(typeInfo.GUIDColumn, typeInfo.DisplayNameColumn);

            if (!String.IsNullOrEmpty(typeInfo.CodeNameColumn) && !typeInfo.CodeNameColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal))
            {
                query.AddColumn(typeInfo.CodeNameColumn);
            }

            return query;
        }


        public IEnumerable<BaseInfo> GetObjects(string objectType, IEnumerable<string> itemIdentifiers, bool useGuidToIdentifyObjects = false)
        {
            var typeInfo = GetTypeInfo(objectType);
            if (useGuidToIdentifyObjects && (String.IsNullOrEmpty(typeInfo.GUIDColumn) || typeInfo.GUIDColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal)))
            {
                throw new InvalidOperationException($"The object type '{typeInfo.ObjectType}' does not have a GUID column defined. The object selector form component can be used only for objects that have a GUID column specified.");
            }

            if (!useGuidToIdentifyObjects && (String.IsNullOrEmpty(typeInfo.CodeNameColumn) || typeInfo.CodeNameColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal)))
            {
                throw new InvalidOperationException($"The object type '{typeInfo.ObjectType}' does not have a code name column defined. Please check whether {nameof(ObjectSelectorProperties.IdentifyObjectByGuid)} property of the editing component is set correctly.");
            }

            return GetObjectsQuery(objectType)
                .WhereIn(useGuidToIdentifyObjects ? typeInfo.GUIDColumn : typeInfo.CodeNameColumn, itemIdentifiers.ToArray());
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
