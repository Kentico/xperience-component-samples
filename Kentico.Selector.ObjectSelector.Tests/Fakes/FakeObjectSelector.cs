using System.Linq;

using Microsoft.AspNetCore.Mvc.Rendering;

using Kentico.Components.Web.Mvc.FormComponents;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class FakeObjectSelector : ObjectSelector
    {
        public FakeObjectSelector(string objectType, bool identifyObjectByGuid)
        {
            Properties = new ObjectSelectorProperties
            {
                ObjectType = objectType,
                IdentifyObjectByGuid = identifyObjectByGuid
            };
            SelectedItems = Enumerable.Empty<SelectListItem>();
        }
    }
}
