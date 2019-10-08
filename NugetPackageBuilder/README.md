# Nuget Generation for Rich Text Editor
This section allows you to build a NuGet package from your Rich Text Editor for easier deployments

# Instructions to Build
1. (Optional) Adjust the `NugetPackageBuilder\RichText\RichText.csproj` project and modify the Assembly name if generating a unique nuget instance
1. Build the `Kentico.Components.sln` in release mode.
1. Run the NugetPackageBuilder\RichText\BuildPackage.bat (Must have nuget.exe installed and set up in the Path environment variable on your computer)