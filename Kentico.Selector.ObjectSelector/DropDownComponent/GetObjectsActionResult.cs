using System.Collections.Generic;

using Kentico.Components.Web.Mvc.Selectors.Controllers;

namespace Kentico.Components.Web.Mvc.Selectors
{
    /// <summary>
    /// Represents the object selector's <see cref="KenticoObjectSelectorController.GetObjects"></see> action result.
    /// </summary>
    public class GetObjectsActionResult
    {
        /// <summary>
        /// Object selector items.
        /// </summary>
        public IEnumerable<ObjectSelectorItemModel> Items { get; set; }


        /// <summary>
        /// Indicates whether a next page of items is available for retrieval.
        /// </summary>
        public bool NextPageAvailable { get; set; }
    }
}
