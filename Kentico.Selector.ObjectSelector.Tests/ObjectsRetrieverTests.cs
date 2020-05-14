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
            public void GetObjectQuery_ReturnsCorrectResult(string objectType, bool hasCodeName, string[] expectedIdentifiers)
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
        public class GetSelectedObjects : ObjectsRetrieverTestsBase
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
            public void GetSelectedObjects_ThrowsException(string objectType, bool useGuid)
            {
                var objectsRetriever = new ObjectsRetriever(siteService);

                Assert.That(() => objectsRetriever.GetSelectedObjects(objectType, Enumerable.Empty<string>(), useGuid), Throws.InvalidOperationException);
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
            public void GetSelectedObjects_ReturnsObjectsByGivenIdentifiersAndObjectType(string objectType, IEnumerable<string> selectIdentifiers, bool useGuid, Type expectedType)
            {
                var objectsRetriever = new ObjectsRetriever(siteService);
                var result = objectsRetriever.GetSelectedObjects(objectType, selectIdentifiers, useGuid);
                var actualIdentifiers = result
                    .ToArray()
                    .Select(info => useGuid ? info[info.TypeInfo.GUIDColumn] : info[info.TypeInfo.CodeNameColumn])
                    .Select(id => id.ToString());

                Assert.That(actualIdentifiers, Is.EquivalentTo(selectIdentifiers));
                Assert.That(result, Is.All.TypeOf(expectedType));
            }
        }


        [TestFixture]
        public class GetObjects : UnitTests
        {
            private InternalsVisibleFakeClassStructure<ContactInfo> contactClassStructureInfo;
            private InternalsVisibleFakeClassStructure<UserInfo> userClassStructureInfo;
            private ObjectsRetriever objectsRetriever;


            [SetUp]
            public void SetUp()
            {
                Fake<ContactGroupMemberInfo, ContactGroupMemberInfoProvider>();
                contactClassStructureInfo = new InternalsVisibleFakeClassStructure<ContactInfo>();
                contactClassStructureInfo.RegisterColumn(ObjectsRetriever.ORDERING_COLUMN_ALIAS, typeof(string));
                var contactProviderFake = Fake<ContactInfo, ContactInfoProvider>().WithOriginalSourceName();
                var contacts = CreateItems<ContactInfo>(new[] { "Test", "Foo", "Bar" }, 7);
                contactProviderFake.WithData(contacts);

                userClassStructureInfo = new InternalsVisibleFakeClassStructure<UserInfo>();
                userClassStructureInfo.RegisterColumn(ObjectsRetriever.ORDERING_COLUMN_ALIAS, typeof(string));
                var userProviderFake = Fake<UserInfo, UserInfoProvider>().WithOriginalSourceName();
                var users = CreateItems<UserInfo>(new[] { "John", "Paul", "Ringo", "George" }, 15);
                userProviderFake.WithData(users);

                UserInfo.TYPEINFO.ClassStructureInfo = userClassStructureInfo;
                ContactInfo.TYPEINFO.ClassStructureInfo = contactClassStructureInfo;
                objectsRetriever = new ObjectsRetriever(Substitute.For<ISiteService>());
            }


            [TestCaseSource(nameof(GetObjectTestCaseSource))]
            public void GetObjects_ReturnsCorrectResult(object searchParams, string[] expectedNames, bool expectedNextPageAvailable)
            {
                // Arrange
                var parameters = searchParams as ObjectsRetrieverSearchParams;
                userClassStructureInfo.RegisterColumn(String.Format(ObjectsRetriever.ORDERING_COLUMN_VALUE_TEMPLATE, UserInfo.TYPEINFO.DisplayNameColumn, parameters.SearchTerm), typeof(string));
                contactClassStructureInfo.RegisterColumn(String.Format(ObjectsRetriever.ORDERING_COLUMN_VALUE_TEMPLATE, ContactInfo.TYPEINFO.DisplayNameColumn, parameters.SearchTerm), typeof(string));

                // Act
                var actualResult = objectsRetriever.GetObjects(parameters, out var actualNextPageAvailable);
                var actualNames = actualResult.Select(info => info[info.TypeInfo.DisplayNameColumn].ToString());

                // Assert
                Assert.That(actualNames, Is.EquivalentTo(expectedNames));
                Assert.That(actualNextPageAvailable, Is.EqualTo(expectedNextPageAvailable));
            }


            private T[] CreateItems<T>(string[] alternatingNames, int count, string objectType = null, Action<T> initializer = null) where T : AbstractInfo<T>, new()
            {
                if ((alternatingNames == null) || (alternatingNames.Length == 0))
                {
                    throw new ArgumentException("Parameter must be a non-empty instance of array.", nameof(alternatingNames));
                }

                if (alternatingNames.Length > count)
                {
                    throw new ArgumentException($"Length of '{nameof(alternatingNames)}' must be equal or greater than a value of '{nameof(count)}'");
                }

                int namesLength = alternatingNames.Length;
                int iterations = count / namesLength;

                var items = new List<T>();

                for (int i = 0; i < namesLength; i++)
                {
                    int upperBound = (i == 0) ? iterations + (count % namesLength) : iterations;
                    for (int j = 0; j < upperBound; j++)
                    {
                        var item = AbstractInfo<T>.New((info) =>
                        {
                            initializer?.Invoke(info);
                            info[info.TypeInfo.DisplayNameColumn] = alternatingNames[i] + j;
                        }, objectType);

                        items.Add(item);
                    }
                }

                return items.ToArray();
            }


            private static IEnumerable<TestCaseData> GetObjectTestCaseSource()
            {
                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = ContactInfo.OBJECT_TYPE,
                    PageIndex = 0,
                    PageSize = 2
                }, new[] { "Bar0", "Bar1" }, true);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = ContactInfo.OBJECT_TYPE,
                    PageIndex = 1,
                    PageSize = 2
                }, new[] { "Foo0", "Foo1" }, true);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = ContactInfo.OBJECT_TYPE,
                    PageIndex = 1,
                    PageSize = 2,
                    SearchTerm = "Test"
                }, new[] { "Test2" }, false);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = ContactInfo.OBJECT_TYPE,
                    PageIndex = 1,
                    PageSize = 10,
                }, new string[0], false);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = UserInfo.OBJECT_TYPE,
                    PageIndex = 0,
                    PageSize = 5,
                }, new[] { "George0", "George1", "George2", "John0", "John1" }, true);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = UserInfo.OBJECT_TYPE,
                    PageIndex = 1,
                    PageSize = 3,
                    SearchTerm = "John",
                }, new[] { "John3", "John4", "John5" }, false);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = UserInfo.OBJECT_TYPE,
                    PageIndex = 2,
                    PageSize = 7,
                }, new[] { "Ringo2" }, false);

                yield return new TestCaseData(new ObjectsRetrieverSearchParams
                {
                    ObjectType = UserInfo.OBJECT_TYPE,
                    PageIndex = 2,
                    PageSize = 7,
                    SearchTerm = "Ozzy",
                }, new string[0], false);
            }
        }
    }
}
