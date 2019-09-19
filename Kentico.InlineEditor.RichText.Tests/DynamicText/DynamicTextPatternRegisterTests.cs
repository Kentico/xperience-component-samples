using System;
using System.Collections.Generic;
using System.Linq;

using CMS.ContactManagement;
using CMS.Tests;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class DynamicTextPatternRegisterTests
    {
        [TestFixture]
        public class GetReplacementFunctionTests : UnitTests
        {
            [SetUp]
            public void SetUp()
            {
                Fake<ContactInfo>();
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            [TestCase("UserName")]
            public void GetReplacementFunction_NotRegisteredPattern_ReturnsNull(string pattern)
            {
                DynamicTextPatternRegister.Instance.GetCurrentContact = () => GetFullContact();

                Func<string> replace = DynamicTextPatternRegister.Instance.GetReplacementFunction(pattern);

                Assert.That(() => replace, Is.Null);
            }


            [TestCase("ContactFirstName", "FIRSTNAME")]
            [TestCase("ContactLastName", "LASTNAME")]
            [TestCase("ContactDescriptiveName", "FIRSTNAME LASTNAME")]
            public void GetReplacementFunction_FullContact_ReturnsResolvedPattern(string pattern, string expectedResult)
            {
                DynamicTextPatternRegister.Instance.GetCurrentContact = () => GetFullContact();

                Func<string> replace = DynamicTextPatternRegister.Instance.GetReplacementFunction(pattern);

                Assert.That(() => replace(), Is.EqualTo(expectedResult));
            }


            [TestCase("ContactFirstName")]
            [TestCase("ContactLastName")]
            [TestCase("ContactDescriptiveName")]
            public void GetReplacementFunction_AnonyousContact_ReturnsResolvedPattern(string pattern)
            {
                DynamicTextPatternRegister.Instance.GetCurrentContact = () => GetAnonymousContact();

                Func<string> replace = DynamicTextPatternRegister.Instance.GetReplacementFunction(pattern);

                Assert.That(() => replace(), Is.Empty);
            }


            private ContactInfo GetFullContact()
            {
                return new ContactInfo
                {
                    ContactFirstName = "FIRSTNAME",
                    ContactLastName = "LASTNAME"
                };
            }


            private ContactInfo GetAnonymousContact()
            {
                return new ContactInfo
                {
                    ContactLastName = "Anonymous - {Date}"
                };
            }
        }


        [TestFixture]
        public class GetRegisteredPatternsTests : UnitTests
        {
            [Test]
            public void GetRegisteredPatterns_NoPatternRegistered_ReturnsEmptyCollection()
            {
                var patternRegister = GetPatternRegister(0);
                var registeredPatterns = patternRegister.GetRegisteredPatterns();

                Assert.That(registeredPatterns, Is.Empty);
            }


            [Test]
            public void GetRegisteredPatterns_SinglePatternRegistered_ReturnsCollectionWithOnePattern()
            {
                var patternRegister = GetPatternRegister(1);
                var registeredPatterns = patternRegister.GetRegisteredPatterns();

                Assert.That(registeredPatterns.Count(), Is.EqualTo(1));
            }


            [Test]
            public void GetRegisteredPatterns_MultiplePatternsAreRegistered_ReturnsCollectionWithMultiplePatternsInCorrectOrder()
            {
                var patternRegister = GetPatternRegister(3);
                var registeredPatterns = patternRegister.GetRegisteredPatterns();
                var patternsInOrder = registeredPatterns.Select(p => p.Pattern);
                var displayNamesInOrder = registeredPatterns.Select(p => p.PatternDisplayName);

                Assert.Multiple(() =>
                {
                    Assert.That(registeredPatterns.Count(), Is.EqualTo(3));
                    Assert.That(patternsInOrder, Is.EquivalentTo(new string[] { "PATTERN1", "PATTERN2", "PATTERN3" }));
                    Assert.That(displayNamesInOrder, Is.EquivalentTo(new string[] { "DISPLAY_NAME1", "DISPLAY_NAME2", "DISPLAY_NAME3" }));
                });
            }


            private DynamicTextPatternRegister GetPatternRegister(int patternsCount)
            {
                var patterns = new List<DynamicTextPattern>();
                for (int i = 1; i <= patternsCount; i++)
                {
                    var dynamicTextPattern = new DynamicTextPattern($"PATTERN{i}", $"DISPLAY_NAME{i}", () => "RESOLVED");
                    patterns.Add(dynamicTextPattern);
                }

                return new DynamicTextPatternRegister(patterns);
            }
        }
    }
}
