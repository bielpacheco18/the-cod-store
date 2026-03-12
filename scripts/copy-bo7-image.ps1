$source = Get-ChildItem -Path (Join-Path $PSScriptRoot '..\public\img') -Filter 'BO7*.png' | Select-Object -First 1
$destination = Join-Path $PSScriptRoot '..\public\img\bo7-bot-lobbies.png'

if (-not $source) {
  throw 'BO7 PNG source file not found in public\\img.'
}

Copy-Item -LiteralPath $source.FullName -Destination $destination -Force
