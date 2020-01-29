using System.Collections.Generic;

using CMS.Base;
using CMS.Core;
using CMS.MacroEngine;
using CMS.Membership;
using CMS.Tests;

using NSubstitute;
using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class DynamicTextResolverTests
    {
        [TestFixture]
        public class ResolveRichTextTests : UnitTests
        {
            private IEventLogService eventLogService;

            [SetUp]
            public void SetUp()
            {
                Fake<UserInfo>();
                MembershipContext.AuthenticatedUser = new CurrentUserInfo(new UserInfo(), false);
                
                // Register the dynamic text test macro method
                Extend<string>.With<DynamicTextTestMacroMethods>();

                eventLogService = Substitute.For<IEventLogService>();
            }


            [TestCase(null, null)]
            [TestCase("", "")]
            [TestCase(" ", " ")]
            [TestCase(" {% ResolveDynamicText %} ", "  ")]
            [TestCase("-{% ResolveDynamicText() %}=", "-=")]
            [TestCase(" {% ResolveDynamicText(\"1\") %} ", "  ")]
            [TestCase(" {% ResolveDynamicText(\"1\", \"2\") %} ", "  ")]
            [TestCase(" {% ResolveDynamicText(\"1\", \"2\", \"3\") % } ", " {% ResolveDynamicText(\"1\", \"2\", \"3\") % } ")]
            [TestCase(" { % ResolveDynamicText(\"1\", \"2\", \"3\") %} ", " { % ResolveDynamicText(\"1\", \"2\", \"3\") %} ")]
            [TestCase("{%ResolveDynamicText('pattern','FIRSTNAME','DEF')%}", "")]
            public void ResolveRichText_PatternNotRecognized_ReturnsDefaultValue(string text, string expectedResult)
            {
                 var register = GetPatternRegister();

                string result = new DynamicTextResolver(register, new DataContainer(), eventLogService).ResolveRichText(text);

                Assert.That(result, Is.EqualTo(expectedResult));
            }


            [TestCase("{%ResolveDynamicText(\"pattern\",\"REGISTERED\",\"DEF\")%}", "RESOLVED")]
            [TestCase("{% ResolveDynamicText(\"pattern\",\"REGISTERED\",\"DEF\")%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText( \"pattern\",\"REGISTERED\",\"DEF\")%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText(\"pattern\" ,\"REGISTERED\",\"DEF\")%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText(\"pattern\", \"REGISTERED\",\"DEF\")%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText(\"pattern\",\"REGISTERED\" ,\"DEF\")%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText(\"pattern\",\"REGISTERED\", \"DEF\")%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText(\"pattern\",\"REGISTERED\",\"DEF\" )%}", "RESOLVED")]
            [TestCase("{%ResolveDynamicText(\"pattern\",\"REGISTERED\",\"DEF\") %}", "RESOLVED")]
            [TestCase("{% ResolveDynamicText(\"pattern\", \"REGISTERED\", \"DEF\") %} {% ResolveDynamicText(\"pattern\", \"REGISTERED\", \"DEF\") %}", "RESOLVED RESOLVED")]
            [TestCase("{% ResolveDynamicText(\"pattern\", \"REGISTERED\", \"DEF\")%} \n {% ResolveDynamicText(\"pattern\", \"REGISTERED\", \"DEF\")%}", "RESOLVED \n RESOLVED")]
            // Not registered patterns return the default value
            [TestCase("{% ResolveDynamicText(\"pattern\", \"NOTREGISTERED\", \"DEF\") %}", "DEF")]
            [TestCase(@"{% ResolveDynamicText(""pattern"", ""NOTREGISTERED"", ""\""DEF\"""") %}", "&quot;DEF&quot;", Description = "Can handle quotes in default value.")]
            [TestCase(@"{% ResolveDynamicText(""pattern"", ""NOTREGISTERED"", ""<D&E&F>"") %}", "&lt;D&amp;E&amp;F&gt;", Description = "Output is encoded.")]
            [TestCase("{% ResolveDynamicText(\"NOTREGISTERED\", \"REGISTERED\", \"DEF\") %}", "DEF")]
            public void ResolveRichText_Pattern_ReturnsCorrectResult(string text, string expectedResult)
            {
                var register = GetPatternRegister();
                var macroResolver = GetMacroResolver();

                string result = new DynamicTextResolver(register, new DataContainer(), eventLogService).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(expectedResult));
                    Assert.That(macroResult, Is.EqualTo(result));
                });
            }


            [TestCase("{% ResolveDynamicText(\"query\", \"REGISTERED\", \"DEF\") %}", "RESOLVED")]
            [TestCase("{% ResolveDynamicText(\"query\", \"NOTREGISTERED\", \"DEF\") %}", "DEF")]
            [TestCase("{% ResolveDynamicText(\"query\", \"NOTREGISTERED\", \"\") %}", "")]
            [TestCase(@"{% ResolveDynamicText(""query"", ""NOTREGISTERED"", ""\""DEF\"""") %}", "&quot;DEF&quot;", Description = "Can handle quotes in default value.")]
            [TestCase(@"{% ResolveDynamicText(""query"", ""NOTREGISTERED"", ""<D&E&F>"") %}", "&lt;D&amp;E&amp;F&gt;", Description = "Output is encoded.")]
            [TestCase("{% ResolveDynamicText(\"query\", \"REGISTERED\", \"DEF\") %} {% ResolveDynamicText(\"query\", \"REGISTERED\", \"DEF\") %}", "RESOLVED RESOLVED")]
            [TestCase("{% ResolveDynamicText(\"query\", \"REGISTERED\", \"DEF\") %} \n {% ResolveDynamicText(\"query\", \"NOTREGISTERED\", \"DEF\") %}", "RESOLVED \n DEF")]
            public void ResolveRichText_QueryString_ReturnsCorrectResult(string text, string expectedResult)
            {
                var register = GetPatternRegister();
                var macroResolver = GetMacroResolver();
                var queryString = GetQueryStringDataContainer("REGISTERED", "RESOLVED");

                string result = new DynamicTextResolver(register, queryString, eventLogService).ResolveRichText(text);
                string macroResult = macroResolver.ResolveMacros(text);

                Assert.Multiple(() =>
                {
                    Assert.That(result, Is.EqualTo(expectedResult));
                    Assert.That(macroResult, Is.EqualTo(result));
                });
            }


            private DynamicTextPatternRegister GetPatternRegister()
            {
                var patterns = new List<DynamicTextPattern>();

                var firstName = new DynamicTextPattern("REGISTERED", "DISPLAY_NAME", () => "RESOLVED");
                patterns.Add(firstName);

                return new DynamicTextPatternRegister(patterns);
            }


            private MacroResolver GetMacroResolver()
            {
                return MacroResolver.GetInstance(false);
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
