using System;
using System.Linq;
using System.Web.Http;

using CMS.Base;
using CMS.Core;
using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;

namespace Kentico.Components.Web.Mvc.Selectors.Controllers
{
    /// <summary>
    /// The object selector API controller.
    /// </summary>
    [UseCamelCasePropertyNamesContractResolver]
    public class KenticoObjectSelectorController : ApiController
    {
        private const int PAGE_ITEMS_COUNT = 50;
        private readonly ISiteService siteService;


        public KenticoObjectSelectorController()
            : this(Service.Resolve<ISiteService>())
        {
        }


        internal KenticoObjectSelectorController(ISiteService siteService)
        {
            this.siteService = siteService;
        }


        /// <summary>
        /// Gets the collection of objects available for selection.
        /// </summary>
        /// <param name="objectType">Object type.</param>
        /// <param name="page">Page number.</param>
        /// <param name="searchTerm">Search term.</param>
        [HttpGet]
        public GetObjectsActionResult GetObjects(string objectType, int page, string searchTerm = null)
        {
            var typeInfo = GetTypeInfo(objectType);
            var infoObjects = GetSelectorObjects(typeInfo, searchTerm);
            var pagedResult = infoObjects.Skip((page - 1) * PAGE_ITEMS_COUNT)
                                         .Take(PAGE_ITEMS_COUNT);

            var result = new GetObjectsActionResult
            {
                SearchItemsCount = infoObjects.Count(), 
                Results = pagedResult.Select(info => new ObjectSelectorItemModel
                {
                    Value = new ObjectSelectorItem
                    {
                        ObjectGuid = Guid.Parse(info[typeInfo.GUIDColumn].ToString())
                    },
                    Text = info[typeInfo.DisplayNameColumn].ToString()
                })
            };

            return result;
        }


        private ObjectQuery<BaseInfo> GetSelectorObjects(ObjectTypeInfo typeInfo, string searchTerm = null)
        {
            var query = new ObjectQuery<BaseInfo>(typeInfo.ObjectType)
               .OnSite(siteService.CurrentSite.SiteName, includeGlobal: true)
               .Columns(typeInfo.GUIDColumn, typeInfo.DisplayNameColumn);

            if (!String.IsNullOrEmpty(searchTerm))
            {
                query = query.WhereLike(typeInfo.DisplayNameColumn, $"%{searchTerm}%");
            }

            return query;
        }


        private ObjectTypeInfo GetTypeInfo(string objectType)
        {
            var typeInfo = ObjectTypeManager.GetTypeInfo(objectType, exceptionIfNotFound: true);

            if (String.IsNullOrEmpty(typeInfo.GUIDColumn) || typeInfo.GUIDColumn.Equals(ObjectTypeInfo.COLUMN_NAME_UNKNOWN, StringComparison.Ordinal))
            {
                throw new InvalidOperationException($"The object type '{typeInfo.ObjectType}' does not have a GUID column defined. The object selector form component can be used only for objects that have a GUID column specified.");
            }

            return typeInfo;
        }
    }
}
