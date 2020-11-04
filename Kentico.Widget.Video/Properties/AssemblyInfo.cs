using System.Runtime.CompilerServices;

using CMS;

// Ensures that the Kentico API can discover and work with custom classes/components registered in the project
[assembly: AssemblyDiscoverable]
[assembly: InternalsVisibleTo("Kentico.Widget.Video.Tests")]