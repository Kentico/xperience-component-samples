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
        internal const string ORDERING_COLUMN_VALUE_TEMPLATE = "(CASE WHEN {0} LIKE '{1}%' THEN 0 ELSE CASE WHEN {0} LIKE '% {1}%' THEN 1 ELSE 2 END END)";
        private readonly ISiteService siteService;


        public ObjectsRetriever(ISiteService siteService)
        {
            this.siteService = siteService;
        }


        /// <summary>
        /// Gets an object query for the given <paramref name="objectType"/>, limited to the current site.
        /// </summary>
        /// <param name="objectType">Object type.</param>
        internal virtual ObjectQuery<BaseInfo> GetObjectsQuery(string objectType)
        {
            var typeInfo = GetTypeInfo(objectType);

            var columns = new List<string>() { typeInfo.DisplayNameColumn };

            if (!String.IsNullOrEmpty(typeInfo.CodeNameColumn) && !typeInfo.CodeNameColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal))
            {
                columns.Add(typeInfo.CodeNameColumn);
            }

            if (!String.IsNullOrEmpty(typeInfo.GUIDColumn) && !typeInfo.GUIDColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal))
            {
                columns.Add(typeInfo.GUIDColumn);
            }

            var query = new ObjectQuery<BaseInfo>(objectType)
               .OnSite(siteService.CurrentSite.SiteName, includeGlobal: true)
               .Columns(columns);

            return query;
        }


        /// <summary>
        /// Gets objects by given <paramref name="searchParams"/>.
        /// </summary>
        /// <param name="searchParams">Search parameters. See <see cref="ObjectsRetrieverSearchParams"/>.</param>
        /// <param name="nextPageAvailable">Indicates whether the retrieved objects' count exceeds current batch size.</param>
        internal virtual IEnumerable<BaseInfo> GetObjects(ObjectsRetrieverSearchParams searchParams, out bool nextPageAvailable)
        {
            var (objectType, searchTerm, pageIndex, pageSize) = searchParams;
            var typeInfo = GetTypeInfo(objectType);

            var query = GetObjectsQuery(typeInfo.ObjectType).Page(pageIndex, pageSize);

            if (!String.IsNullOrEmpty(searchTerm))
            {
                query.WhereLike(typeInfo.DisplayNameColumn, $"%{searchTerm}%")
                     .OrderBy(String.Format(ORDERING_COLUMN_VALUE_TEMPLATE, typeInfo.DisplayNameColumn, searchTerm));
            }

            var result = query.ToArray();
            nextPageAvailable = query.NextPageAvailable;

            return result;
        }


        /// <summary>
        /// Returns complete data of objects given by <paramref name="itemIdentifiers"/>.
        /// </summary>
        /// <param name="objectType"></param>
        /// <param name="itemIdentifiers"></param>
        /// <param name="useGuidToIdentifyObjects">Indicates whether <paramref name="itemIdentifiers"/> represent code names or GUIDs. See <see cref="ObjectSelectorProperties.IdentifyObjectByGuid"/></param>
        /// <exception cref="InvalidOperationException">Thrown when given <paramref name="objectType"/> does not have a GUID or code name column defined, depending on the object identification method defined by <paramref name="useGuidToIdentifyObjects"/>.</exception>
        public IEnumerable<BaseInfo> GetSelectedObjects(string objectType, IEnumerable<string> itemIdentifiers, bool useGuidToIdentifyObjects = false)
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
        private ObjectTypeInfo GetTypeInfo(string objectType)
        {
            return ObjectTypeManager.GetTypeInfo(objectType, exceptionIfNotFound: true);
        }
    }
}
