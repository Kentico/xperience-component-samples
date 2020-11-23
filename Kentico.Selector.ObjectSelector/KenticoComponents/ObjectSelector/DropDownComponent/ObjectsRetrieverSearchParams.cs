namespace Kentico.Components.Web.Mvc.Selectors
{
    /// <summary>
    /// Encapsulates parameters for object retrieval.
    /// </summary>
    internal class ObjectsRetrieverSearchParams
    {
        /// <summary>
        /// Object type.
        /// </summary>
        public string ObjectType { get; set; }

        
        /// <summary>
        /// A term the resulting objects should contain.
        /// </summary>
        public string SearchTerm { get; set; }


        /// <summary>
        /// Zero-based page index.
        /// </summary>
        public int PageIndex { get; set; }


        /// <summary>
        /// Number of objects to retrieve in a single batch.
        /// </summary>
        public int PageSize { get; set; }


        /// <summary>
        /// Allows to deconstruct the object into a tuple.
        /// </summary>
        /// <param name="objectType">Object type. See <see cref="ObjectType"/></param>
        /// <param name="searchTerm">Search term. See <see cref="SearchTerm"/></param>
        /// <param name="pageIndex">Page index. See <see cref="PageIndex"/></param>
        /// <param name="pageSize">Page size. See <see cref="PageSize"/></param>
        public void Deconstruct(out string objectType, out string searchTerm, out int pageIndex, out int pageSize)
        {
            objectType = ObjectType;
            searchTerm = SearchTerm;
            pageIndex = PageIndex;
            pageSize = PageSize;
        }
    }
}
