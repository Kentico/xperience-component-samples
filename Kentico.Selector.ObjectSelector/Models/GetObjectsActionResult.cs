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
        public IEnumerable<ObjectSelectorItemModel> Results { get; set; }


        /// <summary>
        /// Total number of items which satisfy the current search term.
        /// </summary>
        public int SearchItemsCount { get; set; }
    }
}
