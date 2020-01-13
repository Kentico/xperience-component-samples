. "$PSScriptRoot\Shared.ps1"

Function PatchAssemblyInfo {
    <#
    .SYNOPSIS
    Patches a file given by $filePath by appending a $buildNumber to the actual value of AssemblyFileVersion attribute.

    .PARAMETER filePath
    Path of the file being patched.

    .PARAMETER buildNumber
    The build number to be appended.

    .EXAMPLE
    [assembly: AssemblyFileVersion("1.0.0.0")] -> [assembly: AssemblyFileVersion("1.0.0.12345")]
    #>
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
            $newVersion = GetVersionIncludingBuildNumber $match.Groups[1].Value $buildNumber
            "AssemblyFileVersion(""$newVersion"")"
        })
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Patched file: $filePath with build $buildNumber"
}

Function GetVersionIncludingBuildNumber {
    <#
    .SYNOPSIS
    Returns a normalized version number based on $originalVersion in a format X.X.X.Y 
    where Y stands for a build number provided by $buildNumber.

    .PARAMETER originalVersion
    Original version to be normalized and appended with build number.

    .PARAMETER buildNumber
    The build number.

    .EXAMPLE
    1.0.0 -> 1.0.0.12345
    1.0.0.0 -> 1.0.0.12345

    .NOTES
    If $originalVersion has a format X.X.X.Y the value of Y will be lost as it's to be replaced by the $buildNumber.
    #>    
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

Function PatchAllAssemblyInfos {
    Get-ChildItem -Filter "AssemblyInfo.cs" -Recurse | ForEach-Object { PatchAssemblyInfo $_.FullName $env:APPVEYOR_BUILD_NUMBER }
}


PatchAllAssemblyInfos
