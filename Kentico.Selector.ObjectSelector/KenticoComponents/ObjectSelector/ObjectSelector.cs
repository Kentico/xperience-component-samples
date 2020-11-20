using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

using CMS.Base;
using CMS.Core;
using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Components.Web.Mvc.Selectors;
using Kentico.Forms.Web.Mvc;

using Microsoft.AspNetCore.Mvc.Rendering;

[assembly: RegisterFormComponent(ObjectSelector.IDENTIFIER, typeof(ObjectSelector), "{$Kentico.Selector.ObjectSelector.Name$}", ViewName = "~/KenticoComponents/ObjectSelector/_ObjectSelector.cshtml", IsAvailableInFormBuilderEditor = false)]

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents an object selector form component.
    /// </summary>
    public class ObjectSelector : FormComponent<ObjectSelectorProperties, IEnumerable<ObjectSelectorItem>>
    {
        /// <summary>
        /// Represents the <see cref="ObjectSelector"/> identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.ObjectSelector";

        private string mValue;
        private IEnumerable<SelectListItem> selectedListItems;
        private IEnumerable<ObjectSelectorItem> mSelectedObject;
        private readonly ObjectsRetriever objectsRetriever = new ObjectsRetriever(Service.Resolve<ISiteService>());


        /// <summary>
        /// Represents the selected object value.
        /// </summary>
        [BindableProperty]
        public string SelectedValue
        {
            get
            {
                return mValue;
            }
            set
            {
                mSelectedObject = null;
                mValue = value;
            }
        }


        /// <summary>
        /// Returns selected objects as list items.
        /// </summary>
        internal IEnumerable<SelectListItem> SelectedItems
        {
            get => selectedListItems ?? (selectedListItems = objectsRetriever
                .GetSelectedObjects(Properties.ObjectType, SelectedObjects.Select(SelectIdentifier), Properties.IdentifyObjectByGuid)
                .Select(GetSelectedItem));
            set { selectedListItems = value; }
        }


        /// <summary>
        /// The object selector serializer options used across all object selector serializations and deserializations.
        /// </summary>
        internal static JsonSerializerOptions SerializerOptions => new JsonSerializerOptions
        {
            IgnoreNullValues = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };


        private SelectListItem GetSelectedItem(BaseInfo info)
        {
            var typeInfo = info.TypeInfo;
            var displayName = (string)info[typeInfo.DisplayNameColumn];

            var item = Properties.IdentifyObjectByGuid
                ? new ObjectSelectorItem { ObjectGuid = (Guid)info[typeInfo.GUIDColumn] }
                : new ObjectSelectorItem { ObjectCodeName = info.GetStringValue(typeInfo.CodeNameColumn, null) };

            return new SelectListItem
            {
                Text = displayName,
                Value = JsonSerializer.Serialize(item, SerializerOptions),
                Selected = true,
            };
        }


        private string SelectIdentifier(ObjectSelectorItem item) => Properties.IdentifyObjectByGuid ? item.ObjectGuid.ToString() : item.ObjectCodeName;


        private IEnumerable<ObjectSelectorItem> SelectedObjects
        {
            get
            {
                if (mSelectedObject == null)
                {
                    mSelectedObject = !String.IsNullOrEmpty(SelectedValue) ? JsonSerializer.Deserialize<IEnumerable<ObjectSelectorItem>>(SelectedValue, SerializerOptions) : Enumerable.Empty<ObjectSelectorItem>();
                }

                return mSelectedObject;
            }
        }


        /// <summary>
        /// Gets the selected objects.
        /// </summary>
        public override IEnumerable<ObjectSelectorItem> GetValue()
        {
            return SelectedObjects;
        }


        /// <summary>
        /// Sets the selected objects to the selector.
        /// </summary>
        public override void SetValue(IEnumerable<ObjectSelectorItem> value)
        {
            SelectedValue = (value != null) ? JsonSerializer.Serialize(value, SerializerOptions) : null;
        }
    }
}
