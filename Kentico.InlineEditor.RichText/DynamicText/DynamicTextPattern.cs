using System;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    internal class DynamicTextPattern
    {
        public DynamicTextPattern(string pattern, Func<string> getReplacement)
        {
            Pattern = pattern;
            GetReplacement = getReplacement;
        }


        public string Pattern { get; private set; }


        public Func<string> GetReplacement { get; private set; }
    }
}
