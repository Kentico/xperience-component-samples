namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// A model representing a link type with additional link meta data.
    /// </summary>
    internal class LinkModel
    {
        /// <summary>
        /// Gets or sets the type of object the link is pointing to.
        /// </summary>
        public LinkTypeEnum LinkType { get; set; } = LinkTypeEnum.External;

        /// <summary>
        /// Gets or sets a plain link URL without the virtual context data.
        /// </summary>
        public string LinkURL { get; set; }

        /// <summary>
        /// Gets or sets the link meta data model.
        /// </summary>
        public LinkMetadata LinkMetadata { get; set; }
    }
}
