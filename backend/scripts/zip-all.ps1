# Create dist-zip directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "dist-zip"

# Get all .js files in dist directory
Get-ChildItem -Path "dist" -Filter "*.js" | ForEach-Object {
    $name = $_.BaseName
    Compress-Archive -Path $_.FullName -DestinationPath "dist-zip/$name.zip" -Force
}

Write-Host "✅ Zipped all Lambda functions to dist-zip/" 