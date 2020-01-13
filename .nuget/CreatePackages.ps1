. "$PSScriptRoot\Shared.ps1"

Function PackRichText {
    Param (
        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    $richTextAssemblyInfoFilePath = ".\Kentico.Widget.RichText\Properties\AssemblyInfo.cs"
    $version = GetVersionFromAssemblyInfo $richTextAssemblyInfoFilePath
    $version = GetPackageVersion $version

    Invoke-Expression "nuget.exe pack .nuget\Kentico.EMS12.MvcComponents.Widget.RichText.nuspec -BasePath .\ -Version $version -Properties Configuration=$configuration"
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