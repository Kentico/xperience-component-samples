using System;
using System.Linq;

using CMS.Base;
using CMS.DataEngine;
using CMS.Helpers;
using CMS.Tests;

using Kentico.Components.Web.Mvc.Selectors.Controllers;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class KenticoObjectSelectorControllerTests
    {
        [TestFixture]
        public class GetObjects : UnitTests
        {
            [SetUp]
            public void SetUp()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, "pv");
            }


            [Test]
            public void GetObjects_VirtualContextNotInitialized_ThrowsExceptionWithForbiddenStatus()
            {
                VirtualContext.SetItem(VirtualContext.PARAM_PREVIEW_LINK, null);

                var siteService = Substitute.For<ISiteService>();
                var objectsRetriever = Substitute.For<ObjectsRetriever>(siteService);
                var controllerInstance = new KenticoObjectSelectorController(objectsRetriever);

                var result = controllerInstance.GetObjects("", 0);

                Assert.That(result, Is.TypeOf<ForbidResult>());
            }


            [Test, Combinatorial]
            public void GetObjects_ReturnsCorrectResult([Values(null, "", "test")] string searchTerm, [Values(0, 50)] int pageIndex,
                [Values(false, true)] bool nextPageAvailable, [Values(false, true)] bool useGuid)
            {
                const string DISPLAY_NAME = "Test 1";
                const string CODE_NAME = "Test1";
                Guid GUID = Guid.NewGuid();

                Fake<DataClassInfo, DataClassInfoProvider>();

                var siteService = Substitute.For<ISiteService>();
                var objectsRetriever = Substitute.For<ObjectsRetriever>(siteService);
                objectsRetriever.GetObjects(Arg.Any<ObjectsRetrieverSearchParams>(), out Arg.Any<bool>())
                    .Returns(callParams =>
                    {
                        callParams[1] = nextPageAvailable;
                        return new[] { DataClassInfo.New(info =>
                                        {
                                            info.ClassDisplayName = DISPLAY_NAME;
                                            info.ClassName = CODE_NAME;
                                            info.ClassGUID = GUID;
                                        })
                        };
                    });

                var controllerInstance = new KenticoObjectSelectorController(objectsRetriever);
                var actionResult = controllerInstance.GetObjects(DataClassInfo.OBJECT_TYPE, pageIndex, searchTerm, useGuid) as JsonResult;
                var resultValue = actionResult.Value as GetObjectsActionResult;

                objectsRetriever.Received().GetObjects(Arg.Is<ObjectsRetrieverSearchParams>(p =>
                    p.ObjectType == DataClassInfo.OBJECT_TYPE && p.PageIndex == pageIndex && p.PageSize == 50 && p.SearchTerm == searchTerm),
                    out Arg.Any<bool>());

                Assert.That(resultValue, Is.Not.Null);
                Assert.That(resultValue.NextPageAvailable, Is.EqualTo(nextPageAvailable));
                Assert.That(resultValue.Items.Count(), Is.EqualTo(1));

                var item = resultValue.Items.First();

                Assert.That(item.Text, Is.EqualTo(DISPLAY_NAME));

                if (useGuid)
                {
                    Assert.That(item.Value.ObjectCodeName, Is.Null);
                    Assert.That(item.Value.ObjectGuid, Is.EqualTo(GUID));
                }
                else
                {
                    Assert.That(item.Value.ObjectGuid, Is.Null);
                    Assert.That(item.Value.ObjectCodeName, Is.EqualTo(CODE_NAME));
                }
            }
        }
    }
}
