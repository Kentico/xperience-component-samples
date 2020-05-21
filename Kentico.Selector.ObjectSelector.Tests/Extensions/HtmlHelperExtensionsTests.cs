using System;
using System.Web;
using System.Web.Mvc;

using CMS.Tests;

using Kentico.Components.Tests.Base;
using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Components.Web.Mvc.Selectors.Internal;

using NSubstitute;
using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class HtmlHelperExtensionsTests
    {
        [TestFixture]
        public class ObjectSelectorTests : UnitTests
        {
            private const string SELECTOR_ID = "TestID";
            private const string ROUTE_URL = "/Test";
            private const string AUTHENTICATED_URL = "/Authenticated";
            private const string EVENT_NAME = ObjectSelectorConstants.COMPONENT_INITIALIZATION_EVENT_NAME;

            private HtmlHelper<ObjectSelector> htmlHelperMock;
            private UrlHelper urlHelperMock;
            private Func<string, HtmlString> authenticateUrl;


            [SetUp]
            public void SetUp()
            {
                htmlHelperMock = HtmlHelperMock.GetHtmlHelper<ObjectSelector>();
                urlHelperMock = new FakeUrlHelper(ROUTE_URL);
                authenticateUrl = Substitute.For<Func<string, HtmlString>>();
                authenticateUrl(Arg.Any<string>()).Returns(new HtmlString(AUTHENTICATED_URL));
            }


            [Test]
            public void ObjectSelector_HtmlHelperIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => ((HtmlHelper<ObjectSelector>)null).ObjectSelector(urlHelperMock, SELECTOR_ID, authenticateUrl), Throws.ArgumentNullException);
            }


            [Test]
            public void ObjectSelector_UrlHelperIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => htmlHelperMock.ObjectSelector(null, SELECTOR_ID, authenticateUrl), Throws.ArgumentNullException);
            }


            [Test]
            public void ObjectSelector_AuthenticateUrlIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => htmlHelperMock.ObjectSelector(urlHelperMock, SELECTOR_ID, null), Throws.ArgumentNullException);
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            public void ObjectSelector_InvalidId_ThrowsArgumentException(string invalidId)
            {
                Assert.That(() => htmlHelperMock.ObjectSelector(urlHelperMock, invalidId, authenticateUrl), Throws.ArgumentException);
            }


            [TestCase("cms.type1", false)]
            [TestCase("cms.type2", true)]
            public void ObjectSelector_ValidId_ReturnsCorrectResult(string objectType, bool identifyObjectByGuid)
            {
                // Arrange
                htmlHelperMock.ViewData.Model = new FakeObjectSelector(objectType, identifyObjectByGuid);
                var elementName = nameof(ObjectSelector.SelectedValue);
                var expectedMarkup =
$@"<select class=""ktc-form-control"" data-get-objects-endpoint-url=""{AUTHENTICATED_URL}"" data-identify-object-by-guid=""{identifyObjectByGuid}"" " +
    $@"data-initialization-event=""{EVENT_NAME}"" data-object-type=""{objectType}"" id=""{SELECTOR_ID}"" name=""{elementName}"">" +
"</select>" +
$@"<input data-value-for=""{SELECTOR_ID}"" hidden=""true"" id=""SelectedValue"" name=""{elementName}"" type=""text"" value="""" />";
                
                // Act
                var result = htmlHelperMock.ObjectSelector(urlHelperMock, SELECTOR_ID, authenticateUrl).ToString();

                // Assert
                Assert.That(result, Is.EqualTo(expectedMarkup));
                authenticateUrl.Received().Invoke(ROUTE_URL);
            }
        }
    }
}
