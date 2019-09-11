using System;
using System.Collections.Generic;

using CMS.ContactManagement;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Pattern register class that holds all registered patterns that can be resolved in the dynamic text.
    /// </summary>
    internal class DynamicTextPatternRegister
    {
        // List of all registered patterns
        private List<KeyValuePair<string, DynamicTextPattern>> register = new List<KeyValuePair<string, DynamicTextPattern>>();

        private static readonly Lazy<DynamicTextPatternRegister> mInstance = new Lazy<DynamicTextPatternRegister>(() => new DynamicTextPatternRegister());


        /// <summary>
        /// Gets current instance of the <see cref="DynamicTextPatternRegister"/> class.
        /// </summary>
        public static DynamicTextPatternRegister Instance => mInstance.Value;


        /// <summary>
        /// Gets or sets the function which gets the current contact.
        /// </summary>
        internal Func<ContactInfo> GetCurrentContact { get; set; } = () => ContactManagementContext.CurrentContact;


        /// <summary>
        /// Initializes a new instance of the <see cref="DynamicTextPatternRegister"/> class.
        /// </summary>
        public DynamicTextPatternRegister()
        {
            PopulatePatterns();
        }


        internal DynamicTextPatternRegister(List<KeyValuePair<string, DynamicTextPattern>> data)
        {
            register.AddRange(data);
        }


        /// <summary>
        /// Gets the function that replaces the given pattern string.
        /// </summary>
        /// <param name="pattern">The pattern.</param>
        public Func<string> GetReplacementFunction(string pattern)
        {
            var patternItem = register.Find(p => p.Key.Equals(pattern));
            if (patternItem.Value != null)
            {
                return patternItem.Value.GetReplacement;
            }

            return null;
        }


        /// <summary>
        /// Populates the register data with the default set of patterns.
        /// </summary>
        private void PopulatePatterns()
        {
            var firstName = new DynamicTextPattern("ContactManagementContext.CurrentContact.ContactFirstName", () => GetCurrentContact()?.ContactFirstName);
            register.Add(new KeyValuePair<string, DynamicTextPattern>(firstName.Pattern, firstName));

            var lastName = new DynamicTextPattern("ContactManagementContext.CurrentContact.ContactLastName", () => GetCurrentContact()?.ContactLastName);
            register.Add(new KeyValuePair<string, DynamicTextPattern>(lastName.Pattern, lastName));

            var fullName = new DynamicTextPattern("ContactManagementContext.CurrentContact.ContactDescriptiveName", () => GetCurrentContact()?.ContactDescriptiveName);
            register.Add(new KeyValuePair<string, DynamicTextPattern>(fullName.Pattern, fullName));
        }
    }
}
