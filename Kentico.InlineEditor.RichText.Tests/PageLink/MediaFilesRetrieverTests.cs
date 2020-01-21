using System;

using CMS.DataEngine;
using CMS.MediaLibrary;
using CMS.SiteProvider;
using CMS.Tests;

using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    public class MediaFilesRetrieverTests
    {
        [TestFixture, Category.Unit]
        public class CtorTests
        {
            [Test]
            public void Ctor_SiteNameIsNull_ThrowsArgumentNullException()
            {
                Assert.Throws<ArgumentNullException>(() => new MediaFilesRetriever(null));
            }
        }


        [TestFixture]
        public class GetMediaFileTests : UnitTests
        {
            private IMediaFilesRetriever mediaFilesRetriever;
            private MediaFileInfo mediaFile = new MediaFileInfo();
            private const string SITENAME = "siteName";


            [SetUp]
            public void SetUp()
            {
                mediaFilesRetriever = new MediaFilesRetriever(SITENAME);
                Fake<MediaFileInfo, MediaFileInfoProvider>(new MediaFileInfoProviderFake(mediaFile));

                Fake<SiteInfo, SiteInfoProvider>().WithData(
                    new SiteInfo
                    {
                        SiteID = 1,
                        SiteName = SITENAME,
                        SiteIsContentOnly = true
                    });
            }


            [Test]
            public void GetMediaFile_PermanentUrl_FileGuid_ReturnsMediaFile()
            {
                var result = mediaFilesRetriever.GetMediaFile("/getmedia/00000000-0000-0000-0000-000000000001/filename.png");

                Assert.That(result, Is.SameAs(mediaFile));
            }


            [Test]
            public void GetMediaFile_PermanentUrl_NoFileGuid_NoFileReturned()
            {
                var result = mediaFilesRetriever.GetMediaFile("/getmedia/no-guid/filename.png");

                Assert.That(result, Is.Null);
            }


            [Test]
            public void GetMediaFile_DirectPath_ReturnsMediaFile()
            {
                FakeSettings(null, null);

                var result = mediaFilesRetriever.GetMediaFile($"/{SITENAME}/media/libraryName/filename.png");

                Assert.That(result, Is.SameAs(mediaFile));
            }


            [Test]
            public void GetMediaFile_DirectPath_CustomMediaLibraryFolder_ReturnsMediaFile()
            {
                FakeSettings("~/ML", null);

                var result = mediaFilesRetriever.GetMediaFile("/ML/libraryName/filename.png");

                Assert.That(result, Is.SameAs(mediaFile));
            }


            [Test]
            public void GetMediaFile_DirectPath_CustomMediaLibraryFolder_SpecificSiteFolders_ReturnsMediaFile()
            {
                FakeSettings("~/ML", "true");

                var result = mediaFilesRetriever.GetMediaFile($"/ML/{SITENAME}/libraryName/filename.png");

                Assert.That(result, Is.SameAs(mediaFile));
            }


            private void FakeSettings(string CMSMediaLibrariesFolder, string CMSUseMediaLibrariesSiteFolder)
            {
                Fake<SettingsKeyInfo, SettingsKeyInfoProvider>().WithData(
                    new SettingsKeyInfo { KeyName = "CMSMediaLibrariesFolder", KeyValue = CMSMediaLibrariesFolder },
                    new SettingsKeyInfo { KeyName = "CMSUseMediaLibrariesSiteFolder", KeyValue = CMSUseMediaLibrariesSiteFolder }
                );
            }
        }
    }
}
