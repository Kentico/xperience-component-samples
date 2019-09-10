using System;
using System.Text.RegularExpressions;

using CMS.Helpers;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    internal class DynamicTextResolver
    {
        private const string PATTERN_GROUP_NAME = "pattern";
        private const string DEFAULT_VALUE_GROUP_NAME = "defaultValue";

        private Regex patternRegex = RegexHelper.GetRegex($@"{{%\s*(?<{PATTERN_GROUP_NAME}>\S*)\s*(\|\s*\(default\)\s*(?<{DEFAULT_VALUE_GROUP_NAME}>\S*)\s*)?%}}");
        private readonly DynamicTextPatternRegister patternRegister;


        public DynamicTextResolver(DynamicTextPatternRegister patternRegister)
        {
            this.patternRegister = patternRegister;
        }


        /// <summary>
        /// Resolves dynamic text patterns in the given text.
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
            string defaultValue = match.Groups[DEFAULT_VALUE_GROUP_NAME]?.ToString();
            string resolvedValue = match.Value;

            if (!String.IsNullOrEmpty(pattern))
            {
                Func<string> replace = patternRegister.GetReplacementFunction(pattern);
                if (replace != null)
                {
                    string replacement = replace();
                    resolvedValue = GetNotEmpty(replacement, defaultValue);
                }
                else if (pattern.StartsWith("QueryString."))
                {
                    string paramName = pattern.Substring(pattern.IndexOf('.'));
                    string replacement = QueryHelper.GetString(paramName, null);
                    resolvedValue = GetNotEmpty(replacement, defaultValue);
                }
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
