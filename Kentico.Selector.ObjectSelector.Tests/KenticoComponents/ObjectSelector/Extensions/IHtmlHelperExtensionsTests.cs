using System;
using System.Collections.Generic;
using System.Linq;

using CMS.Tests;

using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Components.Web.Mvc.Selectors.Internal;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

using NSubstitute;
using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class IHtmlHelperExtensionsTests
    {
        [TestFixture, Category.Unit]
        public class ObjectSelectorValueTests
        {
            private const string SELECTOR_ID = "TestID";
            private IHtmlHelper<ObjectSelector> htmlHelperMock;


            [SetUp]
            public void SetUp()
            {
                htmlHelperMock = Substitute.For<IHtmlHelper<ObjectSelector>>();
            }


            [Test]
            public void ObjectSelectorValue_HtmlHelperIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => ((IHtmlHelper<ObjectSelector>)null).ObjectSelectorValue(""), Throws.ArgumentNullException);
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            public void ObjectSelectorValue_InvalidId_ThrowsArgumentException(string invalidId)
            {
                Assert.That(() => htmlHelperMock.ObjectSelectorValue(invalidId), Throws.ArgumentException);
            }


            [Test]
            public void ObjectSelectorValue_ValidId_TextBoxForIsCalled()
            {
                // Arrange
                dynamic htmlAttributes = null;

                htmlHelperMock.WhenForAnyArgs(x => x.TextBoxFor(m => m.SelectedValue, default, default))
                              .Do(x =>
                              {
                                  htmlAttributes = x.Args()[2];
                              });

                // Act
                IHtmlHelperExtensions.ObjectSelectorValue(htmlHelperMock, SELECTOR_ID);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(htmlAttributes.hidden, Is.EqualTo("true"));
                    Assert.That(htmlAttributes.data_value_for, Is.EqualTo(SELECTOR_ID));
                });
            }


            [Test]
            public void ObjectSelectorValue_ValidId_ReturnsTextBoxResult()
            {
                string TEXT_BOX_HTML = @"<input type=""text"">";

                // Arrange
                htmlHelperMock.TextBoxFor(m => m.SelectedValue, default, default)
                              .ReturnsForAnyArgs(new HtmlString(TEXT_BOX_HTML));

                // Act
                var result = IHtmlHelperExtensions.ObjectSelectorValue(htmlHelperMock, SELECTOR_ID);

                // Assert
                Assert.That(result.ToString(), Is.EqualTo(TEXT_BOX_HTML));
            }
        }


        [TestFixture]
        public class ObjectSelectorDropDownTests : UnitTests
        {
            private const string SELECTOR_ID = "TestID";
            private const string ROUTE_URL = "/Test";
            private const string AUTHENTICATED_URL = "/Authenticated";

            private IHtmlHelper<ObjectSelector> htmlHelperMock;
            private IUrlHelper urlHelperMock;
            private Func<string, string> authenticateUrl;


            [SetUp]
            public void SetUp()
            {
                htmlHelperMock = Substitute.For<IHtmlHelper<ObjectSelector>>();
                var viewData = new ViewDataDictionary<ObjectSelector>(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = new ObjectSelector
                    {
                        SelectedItems = new List<SelectListItem>()
                    }
                };
                viewData.Model.LoadProperties(new ObjectSelectorProperties());
                htmlHelperMock.ViewData.Returns(viewData);

                authenticateUrl = Substitute.For<Func<string, string>>();
                authenticateUrl(Arg.Any<string>()).Returns(AUTHENTICATED_URL);

                urlHelperMock = Substitute.For<IUrlHelper>();
                urlHelperMock.RouteUrl(default, default).ReturnsForAnyArgs(ROUTE_URL);
            }


            [Test]
            public void ObjectSelectorDropDown_HtmlHelperIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => ((IHtmlHelper<ObjectSelector>)null).ObjectSelectorDropDown(urlHelperMock, SELECTOR_ID, authenticateUrl), Throws.ArgumentNullException);
            }


            [Test]
            public void ObjectSelectorDropDown_UrlHelperIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => htmlHelperMock.ObjectSelectorDropDown(null, SELECTOR_ID, authenticateUrl), Throws.ArgumentNullException);
            }


            [TestCase(null)]
            [TestCase("")]
            [TestCase(" ")]
            public void ObjectSelectorDropDown_SelectorIdEmpty_ThrowsArgumentException(string id)
            {
                Assert.That(() => htmlHelperMock.ObjectSelectorDropDown(urlHelperMock, id, authenticateUrl), Throws.ArgumentException);
            }


            [Test]
            public void ObjectSelectorDropDown_AuthenticateUrlIsNull_ThrowsArgumentNullException()
            {
                Assert.That(() => htmlHelperMock.ObjectSelectorDropDown(urlHelperMock, SELECTOR_ID, null), Throws.ArgumentNullException);
            }


            [TestCase(null)]
            [TestCase("")]
            public void ObjectSelectorDropDown_NullEndpointUrl_ThrowsInvalidOperationException(string endpointUrl)
            {
                urlHelperMock.RouteUrl(default, default).ReturnsForAnyArgs(endpointUrl);

                Assert.That(() => htmlHelperMock.ObjectSelectorDropDown(urlHelperMock, SELECTOR_ID, authenticateUrl), Throws.InvalidOperationException);
            }


            [TestCase("cms.type1", false)]
            [TestCase("cms.type2", true)]
            public void ObjectSelectorDropDown_ValidId_DropDownForIsCalled(string objectType, bool identifyObjectByGuid)
            {
                // Arrange
                htmlHelperMock.ViewData.Model.SelectedItems = new List<SelectListItem> { new SelectListItem("text1", "value1") };
                htmlHelperMock.ViewData.Model.LoadProperties(new ObjectSelectorProperties
                {
                    ObjectType = objectType,
                    IdentifyObjectByGuid = identifyObjectByGuid
                });

                Dictionary<string, object> htmlAttributes = null;
                IEnumerable<SelectListItem> selectedItems = null;

                htmlHelperMock.WhenForAnyArgs(x => x.DropDownListFor(m => m.SelectedValue, Arg.Any<IEnumerable<SelectListItem>>(), Arg.Any<Dictionary<string, object>>()))
                              .Do(x =>
                              {
                                  selectedItems = x.Arg<IEnumerable<SelectListItem>>();
                                  htmlAttributes = x.Arg<Dictionary<string, object>>();
                              });

                // Act
                IHtmlHelperExtensions.ObjectSelectorDropDown(htmlHelperMock, urlHelperMock, SELECTOR_ID, authenticateUrl);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(selectedItems.First().Text, Is.EqualTo("text1"));
                    Assert.That(selectedItems.First().Value, Is.EqualTo("value1"));
                    Assert.That(htmlAttributes["id"], Is.EqualTo(SELECTOR_ID));
                    Assert.That(htmlAttributes["class"], Is.EqualTo(IHtmlHelperExtensions.FORM_CONTROL_CLASS_NAME));
                    Assert.That(htmlAttributes[IHtmlHelperExtensions.OBJECT_TYPE_ATTRIBUTE], Is.EqualTo(objectType));
                    Assert.That(htmlAttributes[IHtmlHelperExtensions.GET_OBJECTS_ENDPOINT_URL_ATTRIBUTE], Is.EqualTo(AUTHENTICATED_URL));
                    Assert.That(htmlAttributes[IHtmlHelperExtensions.INITIALIZATION_EVENT_NAME_ATTRIBUTE], Is.EqualTo(ObjectSelectorConstants.COMPONENT_INITIALIZATION_EVENT_NAME));
                    Assert.That(htmlAttributes[IHtmlHelperExtensions.IDENTIFY_OBJECTS_BY_GUID_ATTRIBUTE], Is.EqualTo(identifyObjectByGuid));
                });
            }


            [Test]
            public void ObjectSelectorDropDown_ValidId_ReturnsTextBoxResult()
            {
                const string DROP_DOWN_HTML = @"<select>";

                // Arrange
                htmlHelperMock.DropDownListFor(m => m.SelectedValue, Arg.Any<IEnumerable<SelectListItem>>(), Arg.Any<Dictionary<string, object>>())
                              .ReturnsForAnyArgs(new HtmlString(DROP_DOWN_HTML));

                // Act
                var result = IHtmlHelperExtensions.ObjectSelectorDropDown(htmlHelperMock, urlHelperMock, SELECTOR_ID, authenticateUrl);

                // Assert
                Assert.That(result.ToString(), Is.EqualTo(DROP_DOWN_HTML));
            }
        }
    }
}
