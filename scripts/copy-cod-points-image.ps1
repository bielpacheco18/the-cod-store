$source = Get-ChildItem -Path (Join-Path $PSScriptRoot '..\public\img') -Filter 'Cheap COD Points*.png' | Select-Object -First 1
$destination = Join-Path $PSScriptRoot '..\public\img\cheap-cod-points.png'

if (-not $source) {
  throw 'Cheap COD Points PNG source file not found in public\img.'
}

Copy-Item -LiteralPath $source.FullName -Destination $destination -Force
