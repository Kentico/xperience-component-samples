using System;

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents an item for the object selector.
    /// </summary>
    public class ObjectSelectorItem
    {
        /// <summary>
        /// Object GUID.
        /// </summary>
        public Guid ObjectGuid { get; set; }


        /// <summary>
        /// Object code name.
        /// </summary>
        public string ObjectCodeName { get; set; }
    }
}
