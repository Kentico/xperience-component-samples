using System;
using System.Linq;
using System.Net;
using System.Net.Http;
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
        private readonly ObjectsRetriever objectsRetriever;


        public KenticoObjectSelectorController()
            : this(Service.Resolve<ISiteService>())
        {
        }


        internal KenticoObjectSelectorController(ISiteService siteService)
        {
            objectsRetriever = new ObjectsRetriever(siteService);
        }


        private ObjectSelectorItem GetItem(BaseInfo info, bool useGuid)
        {
            var typeInfo = info.TypeInfo;
            return useGuid
                ? new ObjectSelectorItem { ObjectGuid = Guid.Parse(info[typeInfo.GUIDColumn].ToString()) }
                : new ObjectSelectorItem { ObjectCodeName = info.GetStringValue(typeInfo.CodeNameColumn, null) };
        }


        /// <summary>
        /// Gets the collection of objects available for selection.
        /// </summary>
        /// <param name="objectType">Object type.</param>
        /// <param name="pageIndex">0-based page index.</param>
        /// <param name="searchTerm">Search term.</param>
        /// <param name="identifyByGuid">Indicates whether objects should be identified using a GUID instead of a code name.</param>
        [HttpGet]
        public GetObjectsActionResult GetObjects(string objectType, int pageIndex, string searchTerm = null, bool identifyByGuid = false)
        {
            try
            {
                var typeInfo = objectsRetriever.GetTypeInfo(objectType);
                var infoObjects = GetSelectorObjects(typeInfo, pageIndex, searchTerm);

                var result = new GetObjectsActionResult
                {
                    NextPageAvailable = infoObjects.NextPageAvailable,
                    Items = infoObjects.Select(info => new ObjectSelectorItemModel
                    {
                        Value = GetItem(info, identifyByGuid),
                        Text = info[typeInfo.DisplayNameColumn].ToString()
                    })
                };

                return result;
            }
            catch (InvalidOperationException exception)
            {
                var message = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(exception.Message)
                };

                throw new HttpResponseException(message);
            }
        }


        private ObjectQuery<BaseInfo> GetSelectorObjects(ObjectTypeInfo typeInfo, int pageIndex, string searchTerm = null)
        {
            var query = objectsRetriever.GetObjectsQuery(typeInfo.ObjectType)
                                        .Page(pageIndex, PAGE_ITEMS_COUNT);

            if (!String.IsNullOrEmpty(searchTerm))
            {
                query = query.WhereLike(typeInfo.DisplayNameColumn, $"%{searchTerm}%");
            }

            return query;
        }
    }
}
