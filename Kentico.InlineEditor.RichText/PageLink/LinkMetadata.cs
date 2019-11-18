using System;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a model of a link meta data.
    /// </summary>
    internal class LinkMetadata
    {
        /// <summary>
        /// Localized page name.
        /// </summary>
        public string Name { get; set;  }


        /// <summary>
        /// Gets the GUID of the object the link is pointing to (node GUID, attachment GUID, media file GUID).
        /// </summary>
        public Guid Identifier { get; set; }
    }
}
