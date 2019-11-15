namespace Kentico.Components.Web.Mvc.InlineEditors
{
    internal class LinkModel
    {
        /// <summary>
        /// Gets the type of object the link is pointing at.
        /// </summary>
        public LinkTypeEnum LinkType { get; set; } = LinkTypeEnum.Unknown;

        /// <summary>
        /// Gets the page model.
        /// </summary>
        public LinkMetadata LinkMetadata { get; set; }
    }
}
