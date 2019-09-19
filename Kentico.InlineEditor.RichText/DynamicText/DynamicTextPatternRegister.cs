﻿using System;
using System.Collections.Generic;
using System.Linq;

using CMS.ContactManagement;

namespace Kentico.Components.Web.Mvc.InlineEditors
{
    /// <summary>
    /// Pattern register class that holds all registered patterns that can be resolved in the dynamic text.
    /// </summary>
    internal class DynamicTextPatternRegister
    {
        // List of all registered patterns
        private readonly List<DynamicTextPattern> register = new List<DynamicTextPattern>();

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


        internal DynamicTextPatternRegister(List<DynamicTextPattern> data)
        {
            register = data;
        }


        /// <summary>
        /// Gets the function that replaces the given pattern string.
        /// </summary>
        /// <param name="pattern">The pattern.</param>
        public Func<string> GetReplacementFunction(string pattern)
        {
            var patternItem = register.FirstOrDefault(p => p.Pattern.Equals(pattern));
            if (patternItem != null)
            {
                return patternItem.GetReplacement;
            }

            return null;
        }


        /// <summary>
        /// Returns registered patterns.
        /// </summary>
        public IEnumerable<DynamicTextPattern> GetRegisteredPatterns()
        {
            return register;
        }


        /// <summary>
        /// Populates the register data with the default set of patterns.
        /// </summary>
        private void PopulatePatterns()
        {
            register.Add(new DynamicTextPattern("ContactFirstName", "First name", () => GetCurrentContact()?.ContactFirstName));
            register.Add(new DynamicTextPattern("ContactLastName", "Last name", () => GetContactLastName(GetCurrentContact())));
            register.Add(new DynamicTextPattern("ContactDescriptiveName", "Full name", () => GetContactFullName(GetCurrentContact())));
        }


        private string GetContactLastName(ContactInfo contact)
        {
            if (contact == null)
            {
                return String.Empty;
            }

            // Do not return the default "Anonymous - {Date}" contact last name for anonymous contacts
            return (!IsAnonymousContact(contact)) ? contact.ContactLastName : String.Empty;
        }


        private string GetContactFullName(ContactInfo contact)
        {
            if (contact == null)
            {
                return String.Empty;
            }

            // Do not return the default "Anonymous - {Date}" contact last name for anonymous contacts
            return (!IsAnonymousContact(contact)) ? contact.ContactDescriptiveName : String.Empty;
        }


        private static bool IsAnonymousContact(ContactInfo contact)
        {
            return contact.ContactLastName.StartsWith(ContactHelper.ANONYMOUS, StringComparison.OrdinalIgnoreCase);
        }
    }
}
