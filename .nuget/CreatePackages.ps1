Function PackRichText {
    Param (
        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    If ($env:APPVEYOR_REPO_TAG -eq "true") {
        $version = $env:APPVEYOR_REPO_TAG_NAME
    } else {
        $referenceAssemblyPath = ".\Kentico.Widget.RichText\bin\$configuration\Kentico.Widget.RichText.dll"
        $resolvedAssemblyPath = Resolve-Path -Path $referenceAssemblyPath
        $version = DetermineAssemblyVersion $resolvedAssemblyPath
        $suffixParam = "-Suffix b$env:APPVEYOR_BUILD_NUMBER"
    }

    Invoke-Expression "nuget.exe pack .nuget\Kentico.EMS12.MvcComponents.Widget.RichText.nuspec -BasePath .\ -Version $version $suffixParam -Properties Configuration=$configuration"
}

Function DetermineAssemblyVersion {
    param (
        [Parameter(Mandatory=$true)]
        [string]
        $assemblyPath
    )

    $version = [System.Reflection.Assembly]::LoadFile($assemblyPath).GetName().Version
    $versionStr = "{0}.{1}.{2}" -f ($version.Major, $version.Minor, $version.Build)
    $versionStr
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