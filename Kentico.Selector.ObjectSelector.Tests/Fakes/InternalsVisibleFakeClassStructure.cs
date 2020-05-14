using System;

using CMS.Tests;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    /// <summary>
    /// By using this class in fakes, we gain access to internal properties of FakeClassStructureInfo.
    /// </summary>
    /// <typeparam name="T">Info type.</typeparam>
    internal class InternalsVisibleFakeClassStructure<T> : FakeClassStructureInfo<T>
    {
        public new void RegisterColumn(string colName, Type colType)
        {
            base.RegisterColumn(colName, colType);
        }
    }
}
