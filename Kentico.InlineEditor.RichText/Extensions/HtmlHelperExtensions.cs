using System;
using System.Linq;
using System.Web.Mvc;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using CMS.Base;
using CMS.Core;
using CMS.DataEngine;
using CMS.Helpers;
using CMS.Membership;
using CMS.LicenseProvider;
using CMS.SiteProvider;

using Kentico.PageBuilder.Web.Mvc;
using Kentico.Web.Mvc;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    public static class HtmlHelperExtensions
    {
        private const string RICH_TEXT_EDITOR_NAME = "Kentico.InlineEditor.RichText";
        private const string RICH_TEXT_EDITOR_CLASS_NAME = "ktc-rich-text-wrapper";
        private const string RICH_TEXT_EDITOR_LICENSE_ATTRIBUTE = "data-rich-text-editor-license";
        private static readonly Lazy<string> richTextEditorLicense = new Lazy<string>(() => SettingsKeyInfoProvider.GetValue("CMSRichTextEditorLicense", SiteContext.CurrentSiteName));


        /// <summary>
        /// HTML helper for rich text inline editor.
        /// </summary>
        /// <param name="instance">The object that provides methods to render HTML fragments.</param>
        /// <param name="propertyName">Name of the widget property which the inline editor edits.</param>
        /// <exception cref="ArgumentNullException">Thrown when the <paramref name="instance"/> is null.</exception>
        public static void RichTextEditor(this ExtensionPoint<HtmlHelper> instance, string propertyName)
        {
            instance = instance ?? throw new ArgumentNullException(nameof(instance));
            if (String.IsNullOrWhiteSpace(propertyName))
            {
                throw new ArgumentException(nameof(propertyName));
            }

            var htmlHelper = instance.Target;

            using (htmlHelper.Kentico().BeginInlineEditor(RICH_TEXT_EDITOR_NAME, propertyName))
            {
                var tagBuilder = new TagBuilder("div");
                tagBuilder.AddCssClass(RICH_TEXT_EDITOR_CLASS_NAME);
                tagBuilder.Attributes.Add(RICH_TEXT_EDITOR_LICENSE_ATTRIBUTE, richTextEditorLicense.Value);

                if (AllowContextMacros())
                {
                    var registeredPatterns = DynamicTextPatternRegister.Instance.GetRegisteredPatterns();
                    if (registeredPatterns.Any())
                    {
                        var contextMacros = registeredPatterns.ToDictionary(p => p.Pattern, p => ResHelper.LocalizeString(p.PatternDisplayName, MembershipContext.AuthenticatedUser.PreferredUICultureCode));
                        var contractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() };
                        var contextMacrosJson = JsonConvert.SerializeObject(contextMacros, new JsonSerializerSettings { ContractResolver = contractResolver });

                        tagBuilder.Attributes.Add("data-context-macros", contextMacrosJson);
                    }
                }

                htmlHelper.ViewContext.Writer.Write(tagBuilder.ToString(TagRenderMode.SelfClosing));
            }
        }


        /// <summary>
        /// Resolves the dynamic text in the rich text.
        /// </summary>
        /// <param name="instance">The object that provides methods to render HTML fragments.</param>
        /// <param name="text">The text to be resolved.</param>
        /// <exception cref="ArgumentNullException">Thrown when the <paramref name="instance"/> is null.</exception>
        public static string ResolveRichText(this ExtensionPoint<HtmlHelper> instance, string text)
        {
            _ = instance ?? throw new ArgumentNullException(nameof(instance));

            return new DynamicTextResolver().ResolveRichText(text);
        }


        private static bool AllowContextMacros()
        {
            var settingsService = Service.Resolve<ISettingsService>();
            var siteService = Service.Resolve<ISiteService>();
            var site = siteService.CurrentSite as SiteInfo;
            var license = LicenseKeyInfoProvider.GetLicenseKeyInfo(site?.DomainName);

            return (license?.Edition == ProductEditionEnum.EnterpriseMarketingSolution) && settingsService[siteService.CurrentSite?.SiteName + ".CMSEnableOnlineMarketing"].ToBoolean(false);
        }
    }
}
