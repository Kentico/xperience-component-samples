namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// A model representing a link type with additional link meta data.
    /// </summary>
    internal class LinkModel
    {
        /// <summary>
        /// Gets the type of object the link is pointing to.
        /// </summary>
        public LinkTypeEnum LinkType { get; set; } = LinkTypeEnum.Unknown;

        /// <summary>
        /// Gets the link meta data model.
        /// </summary>
        public LinkMetadata LinkMetadata { get; set; }
    }
}
