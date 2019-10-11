using System;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a model of page link meta data.
    /// </summary>
    internal class PageLinkModel
    {
        /// <summary>
        /// Localized page name.
        /// </summary>
        public string Name { get; set;  }


        /// <summary>
        /// Gets the node GUID.
        /// </summary>
        public Guid NodeGuid { get; set; }
    }
}
