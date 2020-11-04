using System.Collections.Generic;

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
        /// Indicates whether the Object selector uses the object's GUID column value to identify the object. If set to <c>false</c> the object's code name column value is used. Defaults to <c>false</c>.
        /// <para>
        /// It's recommended to have it set to <c>false</c>, ie. identify objects by their code names if a performance is a concern. The reason is that most system object types incorporate provider-level cache
        /// by the object's code name, not its GUID.
        /// </para>
        /// </summary>
        public bool IdentifyObjectByGuid { get; set; }


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
