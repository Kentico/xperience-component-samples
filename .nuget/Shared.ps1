$versionRegex = 'AssemblyFileVersion\("([^"]+)"\)'

Function GetVersionFromAssemblyInfo {
    <#
    .SYNOPSIS
    Returns a value of AssemblyFileVersion attribute located in given $filePath.
    
    .PARAMETER filePath
    The file path.
    #>
    
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $filePath
    )

    If (-not(Test-Path -Path $filePath)) {
        Write-Host "The file not found: $filePath"
        return
    }

    $result = Select-String -Path $filePath -Pattern $script:versionRegex
    
    If ($result.Matches.Success -ne $true ) {
        Write-Host "Couldn't find AssemblyFileVersion attribute in a given file."
        return    
    }

    $rawVersion = $result.Matches[0].Groups[1].Value
    $rawVersion
}
