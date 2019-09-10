using System;
using System.Collections.Generic;

using CMS.ContactManagement;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    internal class DynamicTextPatternRegister
    {
        private List<KeyValuePair<string, DynamicTextPattern>> register = new List<KeyValuePair<string, DynamicTextPattern>>();


        private static readonly Lazy<DynamicTextPatternRegister> mInstance = new Lazy<DynamicTextPatternRegister>(() => new DynamicTextPatternRegister());


        /// <summary>
        /// Gets current instance of the <see cref="DynamicTextPatternRegister"/> class.
        /// </summary>
        public static DynamicTextPatternRegister Instance => mInstance.Value;


        internal Func<ContactInfo> GetCurrentContact { get; set; } = () => ContactManagementContext.CurrentContact;


        public DynamicTextPatternRegister()
        {
            PopulateRegisterData();
        }


        internal DynamicTextPatternRegister(List<KeyValuePair<string, DynamicTextPattern>> data)
        {
            register.AddRange(data);
        }


        private void PopulateRegisterData()
        {
            var firstName = new DynamicTextPattern("ContactManagementContext.CurrentContact.ContactFirstName", () => GetCurrentContact()?.ContactFirstName);
            register.Add(new KeyValuePair<string, DynamicTextPattern>(firstName.Pattern, firstName));

            var lastName = new DynamicTextPattern("ContactManagementContext.CurrentContact.ContactLastName", () => GetCurrentContact()?.ContactLastName);
            register.Add(new KeyValuePair<string, DynamicTextPattern>(lastName.Pattern, lastName));

            var fullName = new DynamicTextPattern("ContactManagementContext.CurrentContact.ContactDescriptiveName", () => GetCurrentContact()?.ContactDescriptiveName);
            register.Add(new KeyValuePair<string, DynamicTextPattern>(fullName.Pattern, fullName));
        }


        public Func<string> GetReplacementFunction(string pattern)
        {
            var patternItem = register.Find(p => p.Key.Equals(pattern));
            if (patternItem.Value != null)
            {
                return patternItem.Value.GetReplacement;
            }

            return null;
        }
    }
}
