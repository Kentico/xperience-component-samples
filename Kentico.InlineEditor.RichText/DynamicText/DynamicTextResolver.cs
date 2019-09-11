using System;
using System.Text.RegularExpressions;

using CMS.Base;
using CMS.Helpers;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents the resolver class for the dynamic text in the rich text inline editor.
    /// </summary>
    internal class DynamicTextResolver
    {
        private const string PATTERN_GROUP_NAME = "pattern";
        private const string DEFAULT_VALUE_GROUP_NAME = "defaultValue";

        private Regex patternRegex = RegexHelper.GetRegex($@"{{%\s*(?<{PATTERN_GROUP_NAME}>[\w\.]+)\s*(\|\(default\)(?<{DEFAULT_VALUE_GROUP_NAME}>.*?))?%}}");

        private readonly DynamicTextPatternRegister patternRegister;
        private readonly IDataContainer queryParameters;


        /// <summary>
        /// Initializes a new instance of the <see cref="DynamicTextResolver"/> class.
        /// </summary>
        public DynamicTextResolver()
            : this(DynamicTextPatternRegister.Instance, QueryHelper.Instance)
        {
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="DynamicTextResolver"/> class with injected dependencies for the pattern register <see cref="DynamicTextPatternRegister"/> and query string data container <see cref="DataContainer"/>.
        /// </summary>
        internal DynamicTextResolver(DynamicTextPatternRegister patternRegister, IDataContainer queryParameters)
        {
            this.patternRegister = patternRegister;
            this.queryParameters = queryParameters;
        }


        /// <summary>
        /// Resolves the dynamic text in the given text.
        /// </summary>
        /// <param name="text">The text to resolve.</param>
        public string ResolveRichText(string text)
        {
            if (String.IsNullOrEmpty(text))
            {
                return text;
            }

            if (text.Contains("{%"))
            {
                text = patternRegex.Replace(text, ReplaceDynamicTextPattern);
            }

            return text;
        }


        private string ReplaceDynamicTextPattern(Match match)
        {
            string pattern = match.Groups[PATTERN_GROUP_NAME]?.ToString();
            string defaultValue = match.Groups[DEFAULT_VALUE_GROUP_NAME]?.ToString().Trim();
            string resolvedValue = String.Empty;

            if (!String.IsNullOrEmpty(pattern))
            {
                Func<string> replace = patternRegister.GetReplacementFunction(pattern);
                if (replace != null)
                {
                    resolvedValue = replace();
                }
                else if (pattern.StartsWith("QueryString."))
                {
                    string paramName = pattern.Substring(pattern.IndexOf('.') + 1);
                    resolvedValue = queryParameters[paramName]?.ToString();
                }

                resolvedValue = GetNotEmpty(resolvedValue, defaultValue);
            }

            return resolvedValue;
        }


        private string GetNotEmpty(string value, string defaultValue)
        {
            if (String.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            return value;
        }
    }
}
