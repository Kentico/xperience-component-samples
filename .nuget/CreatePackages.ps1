Function PackRichText {
    Param (
        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    If ($env:APPVEYOR_REPO_TAG -eq "true") {
        $version = $env:APPVEYOR_REPO_TAG_NAME
    } else {
        $version = GetPackageVersion
        $suffixParam = "-Suffix b$env:APPVEYOR_BUILD_NUMBER"
    }

    Invoke-Expression "nuget.exe pack .nuget\Kentico.EMS12.MvcComponents.Widget.RichText.nuspec -BasePath .\ -Version $version $suffixParam -Properties Configuration=$configuration"
}

Function GetPackageVersion {
    $version = $env:APPVEYOR_BUILD_VERSION
    $version.SubString(0, $version.LastIndexOf('.'))
}

Function EnsureConfiguration {

    If ([bool]$env:APPVEYOR_REPO_TAG -eq $true) {
        $env:CONFIGURATION = "Release"
    }

    $env:CONFIGURATION = $($env:CONFIGURATION, "Release" | Select-Object -First 1)
    $env:CONFIGURATION
}

$configuration = EnsureConfiguration

PackRichText $configuration