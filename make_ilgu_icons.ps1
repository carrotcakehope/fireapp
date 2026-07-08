Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kyu\Desktop\claude\supply-fireapp\loading\ilgu.png"
$resDir  = "C:\Users\Kyu\Desktop\claude\supply-fireapp\android\app\src\main\res"
$rootDir = "C:\Users\Kyu\Desktop\claude\supply-fireapp"

$rawSrc = [System.Drawing.Bitmap]::FromFile($srcPath)
$bg  = [System.Drawing.Color]::White

# 원본 png 에 실제 캐릭터 주변 투명 여백이 많아 그대로 스케일하면 여백까지 같이 확대됨.
# 실측 콘텐츠 bbox: x[54,410] y[128,386] (462x540 캔버스) -> 여유 20px 두고 크롭
$cropRect = New-Object System.Drawing.Rectangle(34, 108, 396, 298)
$src = $rawSrc.Clone($cropRect, $rawSrc.PixelFormat)
$rawSrc.Dispose()

function New-IconBitmap($size, $scale, [bool]$transparent) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    if ($transparent) {
        $g.Clear([System.Drawing.Color]::Transparent)
    } else {
        $g.Clear($bg)
    }
    $srcRatio = $src.Width / $src.Height
    $targetW = $size * $scale
    $targetH = $targetW / $srcRatio
    if ($targetH -gt $size * $scale) {
        $targetH = $size * $scale
        $targetW = $targetH * $srcRatio
    }
    $x = ($size - $targetW) / 2
    $y = ($size - $targetH) / 2
    $g.DrawImage($src, $x, $y, $targetW, $targetH)
    $g.Dispose()
    return $bmp
}

$densities = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $densities.Keys) {
    $size = $densities[$folder]
    $destDir = Join-Path $resDir $folder

    # legacy launcher (square/round, pre-adaptive-icon launchers) - white bg, safer padding
    $legacy = New-IconBitmap -size $size -scale 0.92 -transparent $false
    $legacy.Save((Join-Path $destDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $legacy.Save((Join-Path $destDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $legacy.Dispose()

    # adaptive icon foreground - transparent bg, safe-zone scale (OS가 마스크로 추가 크롭하니 legacy보다 여유를 둠)
    $fg = New-IconBitmap -size $size -scale 0.72 -transparent $true
    $fg.Save((Join-Path $destDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $fg.Dispose()

    Write-Host "생성됨: $folder ($size x $size)"
}

# PWA icons (root, copied into docs/www by 웹배포.bat)
$pwa192 = New-IconBitmap -size 192 -scale 0.92 -transparent $false
$pwa192.Save((Join-Path $rootDir "icon-192.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$pwa192.Dispose()

$pwa512 = New-IconBitmap -size 512 -scale 0.92 -transparent $false
$pwa512.Save((Join-Path $rootDir "icon-512.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$pwa512.Dispose()

$src.Dispose()
Write-Host "완료!"
