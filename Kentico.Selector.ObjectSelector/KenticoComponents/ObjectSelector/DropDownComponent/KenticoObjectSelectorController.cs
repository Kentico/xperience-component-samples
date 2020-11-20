using System;
using System.Linq;

using CMS.Base;
using CMS.Core;
using CMS.DataEngine;
using CMS.Helpers;

using Kentico.Components.Web.Mvc.FormComponents;

using Microsoft.AspNetCore.Mvc;

namespace Kentico.Components.Web.Mvc.Selectors.Controllers
{
    /// <summary>
    /// The object selector API controller.
    /// </summary>
    public class KenticoObjectSelectorController : Controller
    {
        private const int PAGE_ITEMS_COUNT = 50;
        private readonly ObjectsRetriever objectsRetriever;


        public KenticoObjectSelectorController()
            : this(new ObjectsRetriever(Service.Resolve<ISiteService>()))
        {
        }


        internal KenticoObjectSelectorController(ObjectsRetriever objectsRetriever)
        {
            this.objectsRetriever = objectsRetriever;
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
        /// <param name="pageIndex">Zero-based page index.</param>
        /// <param name="searchTerm">Search term.</param>
        /// <param name="identifyByGuid">Indicates whether objects should be identified using a GUID instead of a code name.</param>
        [HttpGet]
        public IActionResult GetObjects(string objectType, int pageIndex, string searchTerm = null, bool identifyByGuid = false)
        {
            if (!VirtualContext.IsPreviewLinkInitialized)
            {
                return Forbid();
            }

            var infoObjects = objectsRetriever.GetObjects(new ObjectsRetrieverSearchParams
            {
                ObjectType = objectType,
                SearchTerm = searchTerm,
                PageIndex = pageIndex,
                PageSize = PAGE_ITEMS_COUNT,
            }, out var nextPageAvailable);

            var result = new GetObjectsActionResult
            {
                NextPageAvailable = nextPageAvailable,
                Items = infoObjects.Select(info => new ObjectSelectorItemModel
                {
                    Value = GetItem(info, identifyByGuid),
                    Text = info[info.TypeInfo.DisplayNameColumn].ToString()
                })
            };

            return Json(result, ObjectSelector.SerializerOptions);
        }
    }
}
