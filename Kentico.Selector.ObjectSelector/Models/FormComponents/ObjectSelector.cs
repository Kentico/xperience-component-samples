using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using Newtonsoft.Json;

using CMS.Base;
using CMS.Core;
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
    public class ObjectSelector : FormComponent<ObjectSelectorProperties, IList<ObjectSelectorItem>>
    {
        /// <summary>
        /// Represents the <see cref="ObjectSelector"/> identifier.
        /// </summary>
        public const string IDENTIFIER = "Kentico.ObjectSelector";

        private readonly ISiteService siteService = Service.Resolve<ISiteService>();
        private string mValue;
        private IEnumerable<SelectListItem> mItems;
        private IEnumerable<ObjectSelectorItem> mSelectedObject;
        private IDictionary<string, object> mHtmlAttributes;


        /// <summary>
        /// Gets the collection of objects available for selection.
        /// </summary>
        public IEnumerable<SelectListItem> SelectorItems
        {
            get => mItems ?? (mItems = GetSelectorItems());
            set => mItems = value;
        }


        /// <summary>
        /// Attributes for the rendering drop down element.
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


        private IEnumerable<ObjectSelectorItem> SelectedObjects
        {
            get
            {
                if (mSelectedObject == null)
                {
                    mSelectedObject = !String.IsNullOrEmpty(SelectedValue) ? JsonConvert.DeserializeObject<IList<ObjectSelectorItem>>(SelectedValue) : Enumerable.Empty<ObjectSelectorItem>();
                }

                return mSelectedObject;
            }
        }


        /// <summary>
        /// Gets the selected objects.
        /// </summary>
        public override IList<ObjectSelectorItem> GetValue()
        {
            if (SelectedObjects.Any())
            {
                return SelectedObjects as IList<ObjectSelectorItem>;
            }

            return null;
        }


        /// <summary>
        /// Sets the selected objects to the selector.
        /// </summary>
        public override void SetValue(IList<ObjectSelectorItem> value)
        {
            SelectedValue = (value != null) ? JsonConvert.SerializeObject(value) : null;
        }


        private IEnumerable<SelectListItem> GetSelectorItems()
        {
            var typeInfo = GetTypeInfo();
            var infoObjects = GetSelectorObjects(typeInfo);

            var items = infoObjects.Select(info => new
            {
                DisplayName = info[typeInfo.DisplayNameColumn].ToString(),
                SelectorItem = new ObjectSelectorItem
                {
                    ObjectGuid = Guid.Parse(info[typeInfo.GUIDColumn].ToString()),
                }
            });

            foreach (var item in items)
            {
                var listItem = new SelectListItem
                {
                    Text = item.DisplayName,
                    Value = JsonConvert.SerializeObject(new[] { item.SelectorItem })
                };

                yield return listItem;
            }
        }


        private IEnumerable<BaseInfo> GetSelectorObjects(ObjectTypeInfo typeInfo)
        {
            var query = new ObjectQuery<BaseInfo>(typeInfo.ObjectType)
               .OnSite(siteService.CurrentSite.SiteName, includeGlobal: true)
               .Columns(typeInfo.GUIDColumn, typeInfo.DisplayNameColumn);

            return query.TypedResult;
        }


        private ObjectTypeInfo GetTypeInfo()
        {
            var objectType = Properties.ObjectType ?? throw new InvalidOperationException($"Object selector's form component property '{nameof(Properties.ObjectType)}' must be set.");

            return ObjectTypeManager.GetTypeInfo(objectType, exceptionIfNotFound: true);
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
