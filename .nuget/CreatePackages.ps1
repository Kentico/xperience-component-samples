. "$PSScriptRoot\Shared.ps1"

Function PackRichText {
    Param (
        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    $richTextNuspecPath = ".nuget\Kentico.EMS12.MvcComponents.Widget.RichText.nuspec"
    $richTextAssemblyInfoFilePath = ".\Kentico.Widget.RichText\Properties\AssemblyInfo.cs"
    CreatePackage $richTextNuspecPath $richTextAssemblyInfoFilePath $configuration
}

Function PackObjectSelector {
    Param (
        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    $objectSelectorAssemblyInfoFilePath = ".\Kentico.Selector.ObjectSelector\Properties\AssemblyInfo.cs"
    $objectSelectorNuspecPath = ".nuget\Kentico.EMS12.MvcComponents.Selector.ObjectSelector.nuspec"
    CreatePackage $objectSelectorNuspecPath $objectSelectorAssemblyInfoFilePath $configuration
}

Function CreatePackage {
    param (
        [Parameter(Mandatory=$true)]
        [string]
        $nuspecPath,

        [Parameter(Mandatory=$true)]
        [string]
        $referenceAssemblyInfoPath,

        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    $version = GetVersionFromAssemblyInfo $referenceAssemblyInfoPath
    $version = GetPackageVersion $version
    
    $suffix = If ($env:APPVEYOR_REPO_BRANCH -ne "master") { "-Suffix b$env:APPVEYOR_BUILD_NUMBER" } Else { "" }

    Invoke-Expression "nuget.exe pack $nuspecPath -BasePath .\ -Version $version $suffix -Properties Configuration=$configuration"
}

Function GetPackageVersion {
    <#
    .SYNOPSIS
    Returns a version number in a format of X.X.X which is suitable for NuGet package. It cuts the build number off the $fullVersion.
    
    .PARAMETER fullVersion
    Full version number in a format of X.X.X.X
    
    .EXAMPLE
    3.0.2.4352 -> 3.0.2
    #>
    
    param (
        [Parameter(Mandatory=$true)]
        [string]
        $fullVersion
    )
    
    $fullVersion.SubString(0, $fullVersion.LastIndexOf('.'))
}

Function EnsureConfiguration {
    $env:CONFIGURATION = $($env:CONFIGURATION, "Release" | Select-Object -First 1)
}

EnsureConfiguration
PackRichText $env:CONFIGURATION
PackObjectSelector $env:CONFIGURATION