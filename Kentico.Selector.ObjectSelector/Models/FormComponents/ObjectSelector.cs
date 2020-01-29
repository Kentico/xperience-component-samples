using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using CMS.DataEngine;

using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Forms.Web.Mvc;

[assembly: RegisterFormComponent(ObjectSelector.IDENTIFIER, typeof(ObjectSelector), "Object selector", ViewName = "~/Views/Shared/Kentico/Selectors/FormComponents/_ObjectSelector.cshtml", IsAvailableInFormBuilderEditor = false)]

namespace Kentico.Components.Web.Mvc.FormComponents
{
    public class ObjectSelector : SelectorFormComponent<ObjectSelectorProperties>
    {
        public const string IDENTIFIER = "Kentico.ObjectSelector";


        protected override IEnumerable<SelectListItem> GetItems()
        {
            var typeInfo = ObjectTypeManager.GetTypeInfo(Properties.ObjectType);
            var query = new ObjectQuery<BaseInfo>(Properties.ObjectType).Columns(typeInfo.GUIDColumn, typeInfo.DisplayNameColumn);

            return query.TypedResult.Select(info => new SelectListItem
            {
                Value = info[typeInfo.GUIDColumn].ToString(),
                Text = info[typeInfo.DisplayNameColumn].ToString()
            });
        }
    }
}
