param(
  [Parameter(Mandatory)][string]$Frames,
  [Parameter(Mandatory)][string]$Out,
  [int]$Crf = 18,
  [string]$Scale = "1080:1920",
  [int]$Fps = 30
)
ffmpeg -y -framerate $Fps -i "$Frames/f%05d.png" -vf "scale=${Scale}:flags=lanczos" `
  -c:v libx264 -pix_fmt yuv420p -crf $Crf -movflags +faststart "$Out"
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed" }
Write-Output "encoded -> $Out"
