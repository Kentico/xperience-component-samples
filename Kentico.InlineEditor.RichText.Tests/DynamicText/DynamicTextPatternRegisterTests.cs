using System;

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
    }
}
