using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using Newtonsoft.Json;

using CMS.Base;
using CMS.Core;

using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Forms.Web.Mvc;

[assembly: RegisterFormComponent(ObjectSelector.IDENTIFIER, typeof(ObjectSelector), "{$Kentico.Selector.ObjectSelector.Name$}", ViewName = "~/Views/Shared/Kentico/Selectors/FormComponents/_ObjectSelector.cshtml", IsAvailableInFormBuilderEditor = false)]

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

        private readonly ISiteService siteService = Service.Resolve<ISiteService>();
        private string mValue;
        private IEnumerable<SelectListItem> mItems;
        private IEnumerable<ObjectSelectorItem> mSelectedObject;
        private IDictionary<string, object> mHtmlAttributes;


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
