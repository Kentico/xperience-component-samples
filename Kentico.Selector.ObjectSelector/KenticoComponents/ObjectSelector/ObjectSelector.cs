using System;
using System.Collections.Generic;
using System.Linq;

using CMS.Base;
using CMS.Core;
using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Components.Web.Mvc.Selectors;
using Kentico.Forms.Web.Mvc;

using Microsoft.AspNetCore.Mvc.Rendering;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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
                Value = JsonConvert.SerializeObject(item, SerializerSettings),
                Selected = true,
            };
        }


        private string SelectIdentifier(ObjectSelectorItem item) => Properties.IdentifyObjectByGuid ? item.ObjectGuid.ToString() : item.ObjectCodeName;


        private JsonSerializerSettings SerializerSettings => new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            }
        };


        private IEnumerable<ObjectSelectorItem> SelectedObjects
        {
            get
            {
                if (mSelectedObject == null)
                {
                    mSelectedObject = !String.IsNullOrEmpty(SelectedValue) ? JsonConvert.DeserializeObject<IEnumerable<ObjectSelectorItem>>(SelectedValue) : Enumerable.Empty<ObjectSelectorItem>();
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
            SelectedValue = (value != null) ? JsonConvert.SerializeObject(value) : null;
        }
    }
}
