using System.IO;
using System.Web.Mvc;

using CMS.ContactManagement;
using CMS.Tests;

using Kentico.Web.Mvc;

using NSubstitute;
using NUnit.Framework;


namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class HtmlHelperExtensionsTests
    {
        [TestFixture]
        public class RichTextEditorTests
        {
            const string PROPERTY_NAME = "Test";

            private HtmlHelper htmlHelperMock;
            private TextWriter writerMock;


            [SetUp]
            public void SetUp()
            {
                htmlHelperMock = HtmlHelperMock.GetHtmlHelper();
                writerMock = htmlHelperMock.ViewContext.Writer;
            }


            [Test]
            public void RichTextEditor_InstanceIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => ((ExtensionPoint<HtmlHelper>)null).RichTextEditor(PROPERTY_NAME), Throws.ArgumentNullException);
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            public void RichTextEditor_PropertyNameIsInvalid_ThrowsArgumentNullException(string invalidPropertyName)
            {
                Assert.That(() => htmlHelperMock.Kentico().RichTextEditor(invalidPropertyName), Throws.ArgumentException);
            }


            [Test]
            public void RichTextEditor_PropertyNameIsValid_WritesToViewContext()
            {
                htmlHelperMock.Kentico().RichTextEditor(PROPERTY_NAME);

                Received.InOrder(() =>
                {
                    writerMock.Write($"<div data-inline-editor=\"Kentico.InlineEditor.RichText\" data-property-name=\"{PROPERTY_NAME.ToLower()}\">");
                    writerMock.Write($"<div class=\"ktc-rich-text-wrapper\" />");
                    writerMock.Write("</div>");
                });
            }
        }


        [TestFixture]
        public class ResolveRichTextTests : UnitTests
        {
            private HtmlHelper htmlHelperMock;


            [SetUp]
            public void SetUp()
            {
                Fake<ContactInfo>();
                var currentContact = new ContactInfo
                {
                    ContactFirstName = "FIRSTNAME",
                };

                DynamicTextPatternRegister.Instance.GetCurrentContact = () => currentContact;


                htmlHelperMock = HtmlHelperMock.GetHtmlHelper();
            }


            [Test]
            public void ResolveRichText_InstanceIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => ((ExtensionPoint<HtmlHelper>)null).ResolveRichText("text"), Throws.ArgumentNullException);
            }


            [Test]
            public void ResolveRichText_CorrectParameters_ReturnsResolvedText()
            {
                Assert.Multiple(() =>
                {
                    Assert.That(htmlHelperMock.Kentico().ResolveRichText(
                                        "{% ContactManagementContext.CurrentContact.ContactFirstName |(default) RESOLVED %}"),
                                        Is.EqualTo("FIRSTNAME"));
                    Assert.That(htmlHelperMock.Kentico().ResolveRichText(
                                        "{% ContactManagementContext.CurrentContact.ContactLastName |(default) DEFAULT %}"),
                                        Is.EqualTo("DEFAULT"));
                });
            }
        }
    }
}
