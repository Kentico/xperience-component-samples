using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;

using CMS.Tests;

using Newtonsoft.Json.Serialization;
using NUnit.Framework;

namespace Kentico.Components.Web.Mvc.InlineEditors.Tests
{
    [TestFixture, Category.Unit]
    public class UseCamelCasePropertyNamesContractResolverAttributeTests
    {
        private const string serializedJson = @"{""firstProperty"":""First"",""secondProperty"":2,""thirdProperty"":true}";
        private FakeApiController controller;


        private class FakeApiController : ApiController
        {
            public IHttpActionResult GetResult()
            {
                return Ok(new
                {
                    FirstProperty = "First",
                    SecondProperty = 2,
                    ThirdProperty = true
                });
            }
        }


        [SetUp]
        public void SetUp()
        {
            var request = new HttpRequestMessage();
            var configuration = new HttpConfiguration();
            var controllerSettings = new HttpControllerSettings(configuration);

            // alter the JSON serialization formatter
            new UseCamelCasePropertyNamesContractResolverAttribute().Initialize(controllerSettings, null);
            configuration.Formatters.Clear();
            configuration.Formatters.AddRange(controllerSettings.Formatters);

            request.Properties[HttpPropertyKeys.HttpConfigurationKey] = configuration;
            controller = new FakeApiController() { Request = request, Configuration = configuration };
        }


        [Test]
        public void Initialize_CamelCaseFormatterIsSet()
        {
            IContractResolver contractResolver = controller.Configuration.Formatters.JsonFormatter.SerializerSettings.ContractResolver;

            Assert.AreEqual(contractResolver.GetType(), typeof(CamelCasePropertyNamesContractResolver));
        }


        [Test]
        public async Task Initialize_CamelCaseJsonResponseReturned()
        {
            var actionResult = controller.GetResult();
            var response = await actionResult.ExecuteAsync(new CancellationToken());
            var actualResult = await response.Content.ReadAsStringAsync();

            Assert.That(actualResult, Is.EqualTo(serializedJson));
        }
    }
}
