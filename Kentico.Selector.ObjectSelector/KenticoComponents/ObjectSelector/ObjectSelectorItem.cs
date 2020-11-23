using System;

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents an item for the object selector.
    /// </summary>
    public class ObjectSelectorItem
    {
        /// <summary>
        /// Object GUID. It's populated with a value only if <see cref="ObjectSelectorProperties.IdentifyObjectByGuid"/> is <c>true</c>; otherwise it has a value of <c>null</c>.
        /// </summary>
        public Guid? ObjectGuid { get; set; }


        /// <summary>
        /// Object code name.
        /// </summary>
        public string ObjectCodeName { get; set; }
    }
}
