using System;
using System.Text.RegularExpressions;
using System.Web;

using CMS.Base;
using CMS.Helpers;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Represents the resolver class for the dynamic text in the rich text inline editor.
    /// </summary>
    internal class DynamicTextResolver
    {
        private const string MACRO_GROUP_NAME = "pattern";
        private const string TYPE_GROUP_NAME = "type";
        private const string PARAM_NAME_GROUP_NAME = "param_name";
        private const string DEFAULT_VALUE_GROUP_NAME = "default_value";

        private readonly Regex macroPatternRegex = RegexHelper.GetRegex($@"{{%(?<{MACRO_GROUP_NAME}>.*?)%}}");
        private readonly Regex resolveDynamicTextPatternRegex = RegexHelper.GetRegex($@"ResolveDynamicText\(\s*""(?<{TYPE_GROUP_NAME}>[^""]*)""\s*,\s*""(?<{PARAM_NAME_GROUP_NAME}>[^""]*)""\s*,\s*""(?<{DEFAULT_VALUE_GROUP_NAME}>[^""]*)""\s*\)");

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
                text = macroPatternRegex.Replace(text, ReplaceMacroPattern);
            }

            return text;
        }


        private string ReplaceMacroPattern(Match match)
        {
            string macro = match.Groups[MACRO_GROUP_NAME]?.ToString().Trim();

            var resolveDynamicTextMatch = resolveDynamicTextPatternRegex.Match(macro);

            if (resolveDynamicTextMatch.Success)
            {
                return resolveDynamicTextPatternRegex.Replace(macro, ReplaceGetDynamicTextPattern);
            }
            else
            {
                // Return an empty string for all non-matching "macros" to align the dynamic text resolver with the standard macro resolver behavior
                return String.Empty;
            }
        }


        private string ReplaceGetDynamicTextPattern(Match match)
        {
            string patternType = match.Groups[TYPE_GROUP_NAME]?.ToString();
            string paramName = match.Groups[PARAM_NAME_GROUP_NAME]?.ToString();
            string defaultValue = match.Groups[DEFAULT_VALUE_GROUP_NAME]?.ToString();
            string resolvedValue = String.Empty;

            switch (patternType)
            {
                case "pattern":
                    Func<string> replace = patternRegister.GetReplacementFunction(paramName);
                    if (replace != null)
                    {
                        resolvedValue = replace();
                    }
                    break;

                case "query":
                    resolvedValue = queryParameters[paramName]?.ToString();
                    break;
            }

            if (String.IsNullOrEmpty(resolvedValue))
            {
                resolvedValue = defaultValue;
            }

            return HttpUtility.HtmlEncode(resolvedValue);
        }
    }
}
