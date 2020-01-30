using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using Newtonsoft.Json;

using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Forms.Web.Mvc;
using Kentico.Forms.Web.Mvc.Internal;

[assembly: RegisterFormComponent(ObjectSelector.IDENTIFIER, typeof(ObjectSelector), "{$Kentico.Selector.ObjectSelector.Name$}", ViewName = "~/Views/Shared/Kentico/Selectors/FormComponents/_ObjectSelector.cshtml", IsAvailableInFormBuilderEditor = false)]

namespace Kentico.Components.Web.Mvc.FormComponents
{
    /// <summary>
    /// Represents an object selector form component.
    /// </summary>
    public class ObjectSelector : FormComponent<ObjectSelectorProperties, ObjectSelectorItem>
    {
        /// <summary>
        /// Represents the <see cref="ObjectSelector"/> identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.ObjectSelector";

        private string mValue;
        private IEnumerable<SelectListItem> mItems;
        private IDictionary<string, object> mHtmlAttributes;
        private ObjectSelectorItem mSelectedObject;


        /// <summary>
        /// Gets the collection of objects available for selection.
        /// </summary>
        public IEnumerable<SelectListItem> Objects
        {
            get => mItems ?? (mItems = GetObjects());
            set => mItems = value;
        }


        /// <summary>
        /// Attributes for the rendering dropdown element.
        /// </summary>
        public IDictionary<string, object> HtmlAttributes 
        { 
            get => mHtmlAttributes ?? (mHtmlAttributes = GetHtmlAttributes());
            set => mHtmlAttributes = value;
        }


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


        private ObjectSelectorItem SelectedObject
        {
            get
            {
                if (mSelectedObject == null)
                {
                    mSelectedObject = !String.IsNullOrEmpty(SelectedValue) ? JsonConvert.DeserializeObject<ObjectSelectorItem>(SelectedValue) : null;
                }

                return mSelectedObject;
            }
        }


        /// <summary>
        /// Gets the selected object.
        /// </summary>
        /// <returns></returns>
        public override ObjectSelectorItem GetValue()
        {
            return SelectedObject;
        }


        /// <summary>
        /// Sets the selected object to the selector.
        /// </summary>
        /// <param name="value"></param>
        public override void SetValue(ObjectSelectorItem value)
        {
            SelectedValue = (value != null) ? JsonConvert.SerializeObject(value) : null;
        }


        private IEnumerable<SelectListItem> GetObjects()
        {
            var objectType = Properties.ObjectType;
            var typeInfo = ObjectTypeManager.GetTypeInfo(objectType, exceptionIfNotFound: true);
            var query = new ObjectQuery<BaseInfo>(objectType).Columns(typeInfo.GUIDColumn, typeInfo.DisplayNameColumn);

            var items = query.TypedResult.Select(info => new
            {
                DisplayName = info[typeInfo.DisplayNameColumn].ToString(),
                SelectorItem = new ObjectSelectorItem
                {
                    ObjectType = objectType,
                    ObjectGuid = Guid.Parse(info[typeInfo.GUIDColumn].ToString()),
                }
            });

            foreach (var item in items)
            {
                var listItem = new SelectListItem
                {
                    Text = item.DisplayName,
                    Value = JsonConvert.SerializeObject(item.SelectorItem)
                };

                yield return listItem;
            }
        }


        private IDictionary<string, object> GetHtmlAttributes()
        {
            var attributes = new Dictionary<string, object>(SystemRenderingConfigurations.PropertiesEditorField.EditorHtmlAttributes);
            
            if (!HasDependingFields || CustomAutopostHandling)
            {
                attributes[UpdatableMvcForm.NOT_OBSERVED_ELEMENT_ATTRIBUTE_NAME] = null;
            }

            return attributes;
        }
    }
}
