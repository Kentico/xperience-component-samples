using System;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents a registered pattern that can be resolved in the dynamic text.
    /// </summary>
    internal class DynamicTextPattern
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DynamicTextPattern"/> class.
        /// </summary>
        public DynamicTextPattern(string pattern, Func<string> getReplacement)
        {
            Pattern = pattern;
            GetReplacement = getReplacement;
        }


        /// <summary>
        /// Gets the pattern the can be resolved.
        /// </summary>
        public string Pattern { get; }


        /// <summary>
        /// Gets the function that replaces the given pattern string.
        /// </summary>
        public Func<string> GetReplacement { get; }
    }
}
