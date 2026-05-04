Add-Type -AssemblyName System.Drawing

$icoPath = "C:\Users\dotel\Desktop\claude\ilgu.ico"
$outDir = "C:\Users\dotel\Desktop\claude\android\app\src\main\res"

# ICO 파일에서 가장 큰 아이콘 추출
$icon = [System.Drawing.Icon]::ExtractAssociatedIcon($icoPath)
$stream = New-Object System.IO.MemoryStream
$icon.Save($stream)
$stream.Seek(0, [System.IO.SeekOrigin]::Begin)

# ICO를 비트맵으로 변환 (32x32)
$srcBitmap = New-Object System.Drawing.Bitmap($stream)

# 안드로이드 각 해상도별 크기
$sizes = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $destPath = "$outDir\$folder"

    # 고품질 리사이즈
    $destBitmap = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($destBitmap)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $g.DrawImage($srcBitmap, 0, 0, $size, $size)
    $g.Dispose()

    $destBitmap.Save("$destPath\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Save("$destPath\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)

    # foreground도 같은 이미지로
    $destBitmap.Save("$destPath\ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)

    $destBitmap.Dispose()
    Write-Host "생성됨: $folder ($size x $size)"
}

$srcBitmap.Dispose()
$stream.Dispose()
Write-Host "완료!"
