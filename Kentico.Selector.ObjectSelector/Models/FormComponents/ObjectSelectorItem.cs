using System;

using CMS.DataEngine;

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents an item for object selector.
    /// </summary>
    public class ObjectSelectorItem
    {
        /// <summary>
        /// Object GUID.
        /// </summary>
        public Guid ObjectGuid { get; set; }


        /// <summary>
        /// Object type.
        /// </summary>
        /// <seealso cref="PredefinedObjectType"/>
        public string ObjectType { get; set; }
    }
}
