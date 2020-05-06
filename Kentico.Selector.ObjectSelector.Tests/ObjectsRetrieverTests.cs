using System;
using System.Collections.Generic;
using System.Linq;

using CMS.Activities;
using CMS.Base;
using CMS.ContactManagement;
using CMS.DataEngine;
using CMS.Membership;
using CMS.Newsletters;
using CMS.Tests;

using NSubstitute;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class ObjectsRetrieverTests
    {
        [TestFixture]
        public class GetObjectQuery : ObjectsRetrieverTestsBase
        {
            [SetUp]
            public void SetUp()
            {
                PrepareData();
            }


            [TestCase(DataClassInfo.OBJECT_TYPE, true, new[] { "TestClass1", "TestClass2" }, Description = "Returns all object regardless the current site because the object type has M:N relationship to site.")]
            [TestCase(IssueInfo.OBJECT_TYPE, false, new[] { GUID1 }, Description = "Returns only current site's objects.")]
            [TestCase(ContactInfo.OBJECT_TYPE, false, new[] { GUID1 }, Description = "Returns global objects.")]
            public void GetObject_Fooo(string objectType, bool hasCodeName, string[] expectedIdentifiers)
            {
                var typeInfo = ObjectTypeManager.GetTypeInfo(objectType);
                var retriever = new ObjectsRetriever(siteService);
                var query = retriever.GetObjectsQuery(objectType);
                string identifierColumn = hasCodeName ? typeInfo.CodeNameColumn : typeInfo.GUIDColumn;

                var result = query.ToArray();
                var actualNames = result.Select(o => o[identifierColumn].ToString());

                Assert.That(actualNames, Is.EquivalentTo(expectedIdentifiers));
                Assert.That(result.All(o => !String.IsNullOrEmpty(o[typeInfo.DisplayNameColumn].ToString())), Is.True);
            }
        }


        [TestFixture]
        public class GetObjects : ObjectsRetrieverTestsBase
        {
            [SetUp]
            public void SetUp()
            {
                PrepareData();
            }


            [TestCase(IssueInfo.OBJECT_TYPE, false)]
            [TestCase(ActivityInfo.OBJECT_TYPE, false)]
            [TestCase(ActivityInfo.OBJECT_TYPE, true)]
            [TestCase(ActivityTypeInfo.OBJECT_TYPE, true)]
            public void GetObjects_ThrowsException(string objectType, bool useGuid)
            {
                var objectsRetriever = new ObjectsRetriever(siteService);

                Assert.That(() => objectsRetriever.GetObjects(objectType, Enumerable.Empty<string>(), useGuid), Throws.InvalidOperationException);
            }


            // IssueInfo only has GUID column.
            [TestCase(IssueInfo.OBJECT_TYPE, new string[0], true, typeof(IssueInfo))]
            [TestCase(IssueInfo.OBJECT_TYPE, new[] { GUID1 }, true, typeof(IssueInfo))]

            // ContactInfo has GUID column. ContactInfo is a global object.
            [TestCase(ContactInfo.OBJECT_TYPE, new string[0], true, typeof(ContactInfo))]
            [TestCase(ContactInfo.OBJECT_TYPE, new[] { GUID1 }, true, typeof(ContactInfo))]

            // DataClassInfo has both code name and GUID columns.
            [TestCase(DataClassInfo.OBJECT_TYPE, new string[0], false, typeof(DataClassInfo))]
            [TestCase(DataClassInfo.OBJECT_TYPE, new[] { "TestClass2" }, false, typeof(DataClassInfo))]
            [TestCase(DataClassInfo.OBJECT_TYPE, new[] { GUID1 }, true, typeof(DataClassInfo))]

            // UserInfo has both code name and GUID columns. UserInfo has a site binding.
            [TestCase(UserInfo.OBJECT_TYPE, new string[0], false, typeof(UserInfo))]
            [TestCase(UserInfo.OBJECT_TYPE, new[] { "User1" }, false, typeof(UserInfo))]
            [TestCase(UserInfo.OBJECT_TYPE, new[] { GUID1 }, true, typeof(UserInfo))]

            // ActivityType only has code name column.
            [TestCase(ActivityTypeInfo.OBJECT_TYPE, new string[0], false, typeof(ActivityTypeInfo))]
            [TestCase(ActivityTypeInfo.OBJECT_TYPE, new[] { "Activity1" }, false, typeof(ActivityTypeInfo))]
            public void GetObjects_RetunsObjectsByGivenIdentifiersAndObjectType(string objectType, IEnumerable<string> selectIdentifiers, bool useGuid, Type expectedType)
            {
                var objectsRetriever = new ObjectsRetriever(siteService);
                var result = objectsRetriever.GetObjects(objectType, selectIdentifiers, useGuid);
                var actualIdentifiers = result
                    .ToArray()
                    .Select(info => useGuid ? info[info.TypeInfo.GUIDColumn] : info[info.TypeInfo.CodeNameColumn])
                    .Select(id => id.ToString());

                Assert.That(actualIdentifiers, Is.EquivalentTo(selectIdentifiers));
                Assert.That(result, Is.All.TypeOf(expectedType));
            }
        }


        [TestFixture]
        public class GetTypeInfo : UnitTests
        {
            private ISiteService siteService;

            [SetUp]
            public void SetUp()
            {
                siteService = Substitute.For<ISiteService>();
            }


            [Test]
            public void GetTypeInfo_ObjectTypeDoesntExist_ThrowsException()
            {
                const string INVALID_OBJECT_TYPE = "invalidobjecttype";
                var objectsRetriever = new ObjectsRetriever(siteService);

                Assert.That(() => objectsRetriever.GetTypeInfo(INVALID_OBJECT_TYPE), Throws.InvalidOperationException.With.Message.EqualTo($"Object type '{INVALID_OBJECT_TYPE}' not found."));
            }


            [TestCase(UserInfo.OBJECT_TYPE)]
            [TestCase(ActivityInfo.OBJECT_TYPE)]
            [TestCase(ActivityTypeInfo.OBJECT_TYPE)]
            [TestCase(IssueInfo.OBJECT_TYPE)]
            [TestCase(ContactInfo.OBJECT_TYPE)]
            [TestCase(DataClassInfo.OBJECT_TYPE)]
            public void GetTypeInfo_GotValidObjectType_ReturnsTypeInfo(string objectType)
            {
                var objectsRetriever = new ObjectsRetriever(siteService);

                var result = objectsRetriever.GetTypeInfo(objectType);

                Assert.That(result, Is.InstanceOf<ObjectTypeInfo>());
            }
        }
    }
}
