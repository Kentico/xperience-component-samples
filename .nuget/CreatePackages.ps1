Function PackRichText {
    Param (
        [Parameter(Mandatory=$true)]
        [string]
        $version,
        [Parameter(Mandatory=$true)]
        [string]
        $configuration
    )

    $suffixParam = "-Suffix b$env:APPVEYOR_BUILD_NUMBER"

    If ([bool]$env:APPVEYOR_REPO_TAG -eq $true) {
        $suffixParam = ""
        $version = $env:APPVEYOR_REPO_TAG_NAME  
    } 

    Invoke-Expression "nuget.exe pack .nuget\richtext.nuspec -BasePath .\ -Version $version $suffixParam -Properties Configuration=$configuration"
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
$referenceAssemblyPath = ".\Kentico.Widget.RichText\bin\$configuration\Kentico.Widget.RichText.dll"
$resolvedAssemblyPath = Resolve-Path -Path $referenceAssemblyPath
$version = DetermineAssemblyVersion $resolvedAssemblyPath


PackRichText $version $configuration