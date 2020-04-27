using Kentico.Components.Web.Mvc.Selectors.Controllers;

namespace Kentico.Components.Web.Mvc.Selectors
{
    /// <summary>
    /// Object selector constants.
    /// </summary>
    internal static class ObjectSelectorConstants
    {
        /// <summary>
        /// Name of the controller that serves object selector API calls.
        /// </summary>
        public const string CONTROLLER_NAME = "KenticoObjectSelector";

        /// <summary>
        /// Name of the route that serves object selector data.
        /// </summary>
        public const string GET_OBJECTS_ROUTE_NAME = "Kentico.Selector.ObjectSelector.GetObjects";

        /// <summary>
        /// Route that serves object selector data.
        /// </summary>
        public const string GET_OBJECTS_ROUTE = "KenticoComponent/Kentico.Selector.ObjectSelector/" + nameof(KenticoObjectSelectorController.GetObjects);
    }
}
