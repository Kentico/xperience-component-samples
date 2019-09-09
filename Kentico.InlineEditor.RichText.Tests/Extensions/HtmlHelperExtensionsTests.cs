using System.IO;
using System.Text;
using System.Web.Mvc;

using CMS.DataEngine;
using CMS.Tests;

using NSubstitute;
using NUnit.Framework;

using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class HtmlHelperExtensionsTests
    {
        [TestFixture]
        public class RichTextEditorTests : UnitTests
        {
            private const string PROPERTY_NAME = "Test";
            private const string LICENSE_KEY = "license_key";

            private HtmlHelper htmlHelperMock;
            private TextWriter writerMock;


            [SetUp]
            public void SetUp()
            {
                Fake<SettingsKeyInfo, SettingsKeyInfoProvider>()
                    .WithData(new SettingsKeyInfo { KeyName = "CMSRichTextEditorLicense", KeyValue = LICENSE_KEY });

                var writer = new StringWriter(new StringBuilder());
                htmlHelperMock = HtmlHelperMock.GetHtmlHelper(textWriter: writer);
                writerMock = htmlHelperMock.ViewContext.Writer;
            }


            [Test]
            public void RichTextEditor_InstanceIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => ((ExtensionPoint<HtmlHelper>)null).RichTextEditor(PROPERTY_NAME, "propertyValue"), Throws.ArgumentNullException);
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            public void RichTextEditor_PropertyNameIsInvalid_ThrowsArgumentNullException(string invalidPropertyName)
            {
                Assert.That(() => htmlHelperMock.Kentico().RichTextEditor(invalidPropertyName, "propertyValue"), Throws.ArgumentException);
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase("<p>Test</p>")]
            public void RichTextEditor_ValidArguments_WritesToViewContext(string propertyValue)
            {
                htmlHelperMock.Kentico().RichTextEditor(PROPERTY_NAME, propertyValue);

                Received.InOrder(() =>
                {
                    writerMock.Write($"<div data-inline-editor=\"Kentico.InlineEditor.RichText\" data-property-name=\"{PROPERTY_NAME.ToLower()}\">");
                    writerMock.Write($"<div class=\"ktc-rich-text-wrapper\" data-rich-text-editor-license=\"{LICENSE_KEY}\">{propertyValue}</div>");
                    writerMock.Write("</div>");
                });
            }
        }
    }
}
