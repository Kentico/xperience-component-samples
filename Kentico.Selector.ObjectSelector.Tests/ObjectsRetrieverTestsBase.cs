using System;

using CMS.Activities;
using CMS.Base;
using CMS.ContactManagement;
using CMS.DataEngine;
using CMS.Membership;
using CMS.Newsletters;
using CMS.SiteProvider;
using CMS.Tests;

using NSubstitute;

namespace Kentico.Components.Web.Mvc.Selectors.Tests
{
    public class ObjectsRetrieverTestsBase : UnitTests
    {
        protected const string GUID1 = "6ca93bed-3af3-4b74-95b2-79358ed605f2";
        protected ISiteService siteService;

        protected void PrepareData()
        {
            const int SITE1_ID = 1;

            SiteInfo currentSite;

            Fake<SiteInfo, SiteInfoProvider>().WithData(
                currentSite = SiteInfo.New(s =>
                {
                    s.SiteID = SITE1_ID;
                    s.SiteName = "Site1";
                }),
                SiteInfo.New(s =>
                {
                    s.SiteID = 2;
                    s.SiteName = "Site2";
                })
            );

            siteService = Substitute.For<ISiteService>();
            siteService.CurrentSite.Returns(currentSite);

            Fake<IssueInfo, IssueInfoProvider>().WithData(
                IssueInfo.New(issue =>
                {
                    issue.IssueGUID = Guid.Parse(GUID1);
                    issue.IssueDisplayName = "Test1";
                    issue.IssueSiteID = SITE1_ID;
                }),
                IssueInfo.New(issue =>
                {
                    issue.IssueGUID = Guid.NewGuid();
                    issue.IssueDisplayName = "Test2";
                    issue.IssueSiteID = 2;
                })
            );

            Fake<DataClassInfo, DataClassInfoProvider>().WithData(
                DataClassInfo.New(dc =>
                {
                    dc.ClassDisplayName = "Test Class 1 Display Name";
                    dc.ClassName = "TestClass1";
                }),
                DataClassInfo.New(dc =>
                {
                    dc.ClassDisplayName = "Test Class 2 Display Name";
                    dc.ClassName = "TestClass2";
                    dc.ClassGUID = Guid.Parse(GUID1);
                })
            );

            Fake<ContactGroupMemberInfo, ContactGroupMemberInfoProvider>();
            Fake<ContactInfo, ContactInfoProvider>().WithData(
                ContactInfo.New(contact =>
                {
                    contact.ContactEmail = "contact1@test.abc";
                    contact.ContactGUID = Guid.Parse(GUID1);
                    contact.ContactLastName = "TestLastName";
                })
            );

            Fake<UserSiteInfo, UserSiteInfoProvider>().WithData(
                UserSiteInfo.New(userSite =>
                {
                    userSite.UserID = 1;
                    userSite.SiteID = SITE1_ID;
                })
            );

            Fake<UserInfo, UserInfoProvider>().WithData(
                UserInfo.New(user =>
                {
                    user.UserName = "User1";
                    user.UserID = 1;
                    user.UserGUID = Guid.Parse(GUID1);
                })
            );

            Fake<ActivityTypeInfo, ActivityTypeInfoProvider>().WithData(
                ActivityTypeInfo.New(at =>
                {
                    at.ActivityTypeName = "Activity1";
                })
            );
        }
    }
}
