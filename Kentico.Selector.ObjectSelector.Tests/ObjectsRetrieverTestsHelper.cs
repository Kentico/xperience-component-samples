using System;
using System.Collections.Generic;

using CMS.DataEngine;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    internal static class ObjectsRetrieverTestsHelper
    {
        public static T[] CreateItems<T>(string[] alternatingNames, int count, string objectType = null, Action<T, string> initializer = null) where T : AbstractInfo<T>, new()
        {
            if ((alternatingNames == null) || (alternatingNames.Length == 0))
            {
                throw new ArgumentException("Parameter must be a non-empty instance of array.", nameof(alternatingNames));
            }

            if (alternatingNames.Length > count)
            {
                throw new ArgumentException($"Length of '{nameof(alternatingNames)}' must be equal or greater than a value of '{nameof(count)}'");
            }

            int namesLength = alternatingNames.Length;
            int iterations = count / namesLength;

            var items = new List<T>();

            for (int i = 0; i < namesLength; i++)
            {
                int upperBound = (i == 0) ? iterations + (count % namesLength) : iterations;
                for (int j = 0; j < upperBound; j++)
                {
                    string newObjectName = alternatingNames[i] + j;
                    var item = AbstractInfo<T>.New((info) =>
                    {
                        initializer?.Invoke(info, newObjectName);
                        info[info.TypeInfo.DisplayNameColumn] = newObjectName;
                    }, objectType);

                    items.Add(item);
                }
            }

            return items.ToArray();
        }
    }
}
