$versionRegex = 'AssemblyFileVersion\("([^"]+)"\)'
$richTextAssemblyInfoFilePath = ".\Kentico.Widget.RichText\Properties\AssemblyInfo.cs"

Function PatchAssemblyInfo {
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $filePath,

        [Parameter(Mandatory = $true)]
        [string]
        $buildNumber
    )

    If (-not (Test-Path -Path $filePath)) {
        Write-Host "The file not found: $filePath"
        return
    }

    $content = Get-Content -Path $filePath -Encoding UTF8 -Raw

    $content = [regex]::Replace($content, $script:versionRegex , `
        { 
            param ($match) 
            $newVersion = UpdateVersion $match.Groups[1].Value $buildNumber
            "AssemblyFileVersion(""$newVersion"")"
        })
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Patched file: $filePath with build $buildNumber"
}

Function UpdateVersion {
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $originalVersion,

        [Parameter(Mandatory = $true)]
        [string]
        $buildNumber
    )

    $periodCount = [regex]::matches($originalVersion, '\.').Count
    
    Switch ($periodCount) {
        3 {
            $newVersion = $originalVersion.Substring(0, $originalVersion.LastIndexOf('.') + 1) + $buildNumber
            break
        }
        2 {
            $newVersion = "$originalVersion.$buildNumber"
            break
        }
        default {
            Write-Error -Message "Version number was expected in a format 'X.X.X' or 'X.X.X.X'"
            $originalVersion
            return 
        }
    }

    $newVersion
}

Function UpdateAppveyorVersion {
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline)]
        [string]
        $version
    )
    Write-Host "Update appveyor version: $version"
    Update-AppveyorBuild -Version $version
}

Function GetVersionFromAssemblyInfo {
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $filePath
    )

    If (Test-Path -Path $filePath) {
        $result = Select-String -Path $filePath -Pattern $script:versionRegex
        $rawVersion = $result.Matches[0].Groups[1].Value
        $rawVersion
    }
}

Function PatchAllAssemblyInfos {
    Get-ChildItem -Filter "AssemblyInfo.cs" -Recurse | ForEach-Object { PatchAssemblyInfo $_.FullName $env:APPVEYOR_BUILD_NUMBER }
}

Function SetBuildVersion {
    If ($env:APPVEYOR_REPO_TAG -eq "true") {
        $richTextVersion = $env:APPVEYOR_REPO_TAG_NAME
    }
    Else {
        $richTextVersion = GetVersionFromAssemblyInfo $script:richTextAssemblyInfoFilePath
    }
    
    $richTextVersion = UpdateVersion $richTextVersion $env:APPVEYOR_BUILD_NUMBER 
    UpdateAppveyorVersion $richTextVersion
}


SetBuildVersion
PatchAllAssemblyInfos
