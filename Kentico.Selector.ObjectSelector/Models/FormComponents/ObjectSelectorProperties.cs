﻿using System.Collections.Generic;

using CMS.DataEngine;

using Kentico.Forms.Web.Mvc;

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents properties of the <see cref="ObjectSelector"/>.
    /// </summary>
    public class ObjectSelectorProperties : FormComponentProperties<IEnumerable<ObjectSelectorItem>>
    {
        /// <summary>
        /// Default value.
        /// </summary>
        public override IEnumerable<ObjectSelectorItem> DefaultValue { get; set; }


        /// <summary>
        /// Object type.
        /// </summary>
        /// <seealso cref="PredefinedObjectType"/>
        public string ObjectType { get; set; }


        /// <summary>
        /// Creates an instance of the <see cref="ObjectSelectorProperties"/> class.
        /// </summary>
        /// <remarks>
        /// The constructor initializes the base class to data type <see cref="FieldDataType.Unknown"/>.
        /// </remarks>
        public ObjectSelectorProperties()
            : base(FieldDataType.Unknown)
        {
        }
    }
}
