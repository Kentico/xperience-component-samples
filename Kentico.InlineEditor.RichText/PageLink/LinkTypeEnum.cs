namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a link type enumeration.
    /// </summary>
    internal enum LinkTypeEnum
    {
        /// <summary>
        /// A link URL points to an existing page.
        /// </summary>
        Page,

        /// <summary>
        /// A link URL points to an existing media file.
        /// </summary>
        MediaFile,


        /// <summary>
        /// A link URL pointing to the same application but is not of any of the supported object types.
        /// </summary>
        Local,

        /// <summary>
        /// A link URL pointing to an external web application.
        /// </summary>
        External
    }
}
