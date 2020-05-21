using Kentico.Components.Web.Mvc.FormComponents;
using System.Linq;
using System.Web.Mvc;

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
