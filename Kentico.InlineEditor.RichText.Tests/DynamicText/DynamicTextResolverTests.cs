using System.Collections.Generic;
using CMS.Base;
using CMS.MacroEngine;
using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class DynamicTextResolverTests
    {
        [TestFixture]
        public class ResolveRichTextTests
        {
            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            [TestCase("UserName")]
            [TestCase("FIRSTNAME")]
            [TestCase(" FIRSTNAME ")]
            [TestCase(" {% FIRSTNAME ")]
            [TestCase(" { % FIRSTNAME %} ")]
            [TestCase(" {% FIRSTNAME % } ")]
            public void ResolveRichText_PatternNotRecognized_ReturnsDefaultValue(string text)
            {
                var register = GetPatternRegister();
                var macroResolver = GetMacroResolver();

                string result = new DynamicTextResolver(register, new DataContainer()).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(text));
                    Assert.That(macroResult, Is.EqualTo(result));
                });
            }


            [TestCase("{% BLANK %}", "")]
            [TestCase("{% FIRSTNAME.ABC %}", "")]
            [TestCase("{% FIRSTNAME.ABC |(default) 1 %}", "1")]
            public void ResolveRichText_NotRegisteredPattern_ReturnsDefaultValue(string text, string expectedResult)
            {
                var register = GetPatternRegister();
                var macroResolver = GetMacroResolver();

                string result = new DynamicTextResolver(register, new DataContainer()).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(expectedResult));
                    Assert.That(macroResult, Is.EqualTo(expectedResult));
                });
            }


            [TestCase("{%FIRSTNAME%}", "RESOLVED")]
            [TestCase("{% FIRSTNAME%}", "RESOLVED")]
            [TestCase("{%FIRSTNAME %}", "RESOLVED")]
            [TestCase("{% FIRSTNAME %}", "RESOLVED")]
            [TestCase(" {%FIRSTNAME%} ", " RESOLVED ")]
            [TestCase(" {% FIRSTNAME%} ", " RESOLVED ")]
            [TestCase(" {%FIRSTNAME %} ", " RESOLVED ")]
            [TestCase(" {% FIRSTNAME %} ", " RESOLVED ")]
            [TestCase(" {% FIRSTNAME %} {% FIRSTNAME %} ", " RESOLVED RESOLVED ")]
            [TestCase(" {% FIRSTNAME %} \n {% FIRSTNAME %} ", " RESOLVED \n RESOLVED ")]
            public void ResolveRichText_SimplePattern_ReturnsCorrectResult(string text, string expectedResult)
            {
                var register = GetPatternRegister();
                var macroResolver = GetMacroResolver();

                string result = new DynamicTextResolver(register, new DataContainer()).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(expectedResult));
                    Assert.That(macroResult, Is.EqualTo(result));
                });
            }


            [TestCase("{% FIRSTNAME |(default) DEF%}", "DEF")]
            [TestCase("{% FIRSTNAME |(default) DEF %}", "DEF")]
            [TestCase("{% FIRSTNAME |(default)DEF%}", "DEF")]
            [TestCase("{% FIRSTNAME |(default)DEF %}", "DEF")]
            [TestCase("{% FIRSTNAME|(default)DEF%}", "DEF")]
            [TestCase("{% FIRSTNAME|(default)%}", "")]
            [TestCase("{% FIRSTNAME|(default) %}", "")]
            [TestCase("{% FIRSTNAME|(default)DEF1%} {% FIRSTNAME|(default)DEF2%}", "DEF1 DEF2")]
            [TestCase("{% FIRSTNAME|(default)DEF1%} \n {% FIRSTNAME|(default)DEF2%}", "DEF1 \n DEF2")]
            public void ResolveRichText_PatternWithDefaultValue_ReturnsCorrectResult(string text, string expectedResult)
            {
                var register = GetPatternRegister(resolvedValue: "");
                var macroResolver = GetMacroResolver(resolvedValue: "");

                string result = new DynamicTextResolver(register, new DataContainer()).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(expectedResult));
                    Assert.That(macroResult, Is.EqualTo(result));
                });
            }


            [TestCase("{% QueryString.ABC %}", "VALUE")]
            [TestCase("{% QueryString.NOTREGISTERED %}", "")]
            [TestCase("{% QueryString.NOTREGISTERED |(default) DEF%}", "DEF")]
            [TestCase("{% QueryString.ABC %} {% QueryString.ABC %}", "VALUE VALUE")]
            [TestCase("{% QueryString.ABC %} \n {% QueryString.NOTREGISTERED|(default)DEF %}", "VALUE \n DEF")]
            public void ResolveRichText_QueryStringPattern_ReturnsCorrectResult(string text, string expectedResult)
            {
                var register = GetPatternRegister();
                var queryString = GetQueryStringDataContainer("ABC", "VALUE");
                var macroResolver = GetMacroResolver();
                macroResolver.SetNamedSourceData("QueryString", queryString);

                string result = new DynamicTextResolver(register, queryString).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(expectedResult));
                    Assert.That(macroResult, Is.EqualTo(result));
                });
            }


            private DynamicTextPatternRegister GetPatternRegister(string pattern = "FIRSTNAME", string resolvedValue = "RESOLVED")
            {
                var patterns = new List<KeyValuePair<string, DynamicTextPattern>>();

                var firstName = new DynamicTextPattern("FIRSTNAME", () => resolvedValue);
                patterns.Add(new KeyValuePair<string, DynamicTextPattern>(firstName.Pattern, firstName));

                return new DynamicTextPatternRegister(patterns);
            }


            private MacroResolver GetMacroResolver(string pattern = "FIRSTNAME", string resolvedValue = "RESOLVED")
            {
                var macroResolver = MacroResolver.GetInstance(false);
                macroResolver.SetNamedSourceData(new Dictionary<string, object>
                {
                    { pattern, resolvedValue }
                });

                return macroResolver;
            }


            private IDataContainer GetQueryStringDataContainer(string queryParameter, string resolvedValue)
            {
                var queryString = new DataContainer();
                queryString.SetValue(queryParameter, resolvedValue);

                return queryString;
            }
        }
    }
}
