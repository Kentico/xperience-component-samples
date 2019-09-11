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
                var currentContact = new ContactInfo
                {
                    ContactFirstName = "FIRSTNAME",
                    ContactLastName = "LASTNAME"
                };

                DynamicTextPatternRegister.Instance.GetCurrentContact = () => currentContact;
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            [TestCase("UserName")]
            public void GetReplacementFunction_NotRegisteredPattern_ReturnsNull(string pattern)
            {
                Func<string> replace = DynamicTextPatternRegister.Instance.GetReplacementFunction(pattern);

                Assert.That(() => replace, Is.Null);
            }


            [TestCase("ContactManagementContext.CurrentContact.ContactFirstName", "FIRSTNAME")]
            [TestCase("ContactManagementContext.CurrentContact.ContactLastName", "LASTNAME")]
            [TestCase("ContactManagementContext.CurrentContact.ContactDescriptiveName", "FIRSTNAME LASTNAME")]
            public void GetReplacementFunction_RegisteredPattern_ReturnsResolvedPattern(string pattern, string expectedResult)
            {
                Func<string> replace = DynamicTextPatternRegister.Instance.GetReplacementFunction(pattern);

                Assert.That(() => replace(), Is.EqualTo(expectedResult));
            }
        }
    }
}
