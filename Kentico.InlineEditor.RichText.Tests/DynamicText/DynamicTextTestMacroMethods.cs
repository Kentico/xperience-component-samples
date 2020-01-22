using System;
using System.Web;

using CMS.MacroEngine;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    /// <summary>
    /// Represents a class holding macro methods used in tests.
    /// </summary>
    public class DynamicTextTestMacroMethods : MacroMethodContainer
    {
        /// <summary>
        /// Test macro method that is used for macro resolver tests. This proves that the dynamic text format is a K# macro-compatible format.
        /// This method tries to prove that if we change the dynamic text resolver to the macro resolver in the future,
        /// we will be able to resolve already entered dynamic texts in rich texts.
        /// </summary>
        [MacroMethod(typeof(string), "Resolves the dynamic text in a rich text.", 3)]
        [MacroMethodParam(0, "type", typeof(string), "Text to resolve.")]
        [MacroMethodParam(1, "paramName", typeof(string), "Text to resolve.")]
        public static object ResolveDynamicText(EvaluationContext context, params object[] parameters)
        {
            string type = parameters[0] as string;
            string paramName = parameters[1] as string;
            string defaultValue = parameters[2] as string;

            bool isTypeRegistered = (type.Equals("pattern", StringComparison.Ordinal)) || (type.Equals("query", StringComparison.Ordinal));

            if (isTypeRegistered && paramName.Equals("REGISTERED", StringComparison.Ordinal))
            {
                return "RESOLVED";
            }

            return HttpUtility.HtmlEncode(defaultValue);
        }
    }
}
