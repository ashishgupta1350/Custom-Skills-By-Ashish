param(
  [Parameter(Mandatory = $true)][string]$Html,      # full path to the video's HTML file
  [Parameter(Mandatory = $true)][string]$Out,       # folder for f_00000.png ...
  [Parameter(Mandatory = $true)][double]$End,       # video length in seconds
  [double]$Start = 0,
  [int]$Fps = 60,
  [int]$Width = 1920,
  [int]$Height = 1080,
  [string]$SeekFn = 'jump',                         # page function that pauses and shows time t
  [string]$Ready = 'window.__ready === true',       # expression that is true once the timeline is built
  [int]$Port = 9333
)
# Renders a seek-driven HTML animation frame by frame: headless Chrome is seeked to each
# timestamp over the DevTools protocol and screenshotted. Needs only Chrome or Edge.
$ErrorActionPreference = 'Stop'
$browser = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $browser) { throw 'Chrome or Edge was not found' }
$prof = Join-Path $env:TEMP 'motion-video-cdp-profile'
$name = [IO.Path]::GetFileName($Html)
$url = 'file:///' + $Html.Replace('\', '/') + '?clean&t=0'
New-Item -ItemType Directory -Force $Out | Out-Null
$p = Start-Process $browser -PassThru -ArgumentList @('--headless=new', "--remote-debugging-port=$Port", '--remote-allow-origins=*', "--user-data-dir=`"$prof`"", "--window-size=$Width,$Height", '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run', '--mute-audio', "`"$url`"")
try {
  $target = $null
  for ($i = 0; $i -lt 60 -and -not $target; $i++) {
    Start-Sleep -Milliseconds 500
    try { $target = (Invoke-RestMethod "http://127.0.0.1:$Port/json") | Where-Object { $_.type -eq 'page' -and $_.url -like "*$name*" } | Select-Object -First 1 } catch {}
  }
  if (-not $target) { throw 'The browser did not expose the page' }
  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ct = [Threading.CancellationToken]::None
  $ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, $ct).Wait()
  $buf = New-Object byte[] 1048576
  $seg = New-Object 'System.ArraySegment[byte]' -ArgumentList @(, $buf)
  $ms = New-Object IO.MemoryStream
  $script:id = 0
  function Send($method, $params) {
    $script:id++
    $msg = @{id = $script:id; method = $method; params = $params} | ConvertTo-Json -Depth 6 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
    $ws.SendAsync((New-Object 'System.ArraySegment[byte]' -ArgumentList @(, $bytes)), 'Text', $true, $ct).Wait()
    while ($true) {
      $ms.SetLength(0)
      do { $r = $ws.ReceiveAsync($seg, $ct).Result; $ms.Write($buf, 0, $r.Count) } while (-not $r.EndOfMessage)
      $s = [Text.Encoding]::UTF8.GetString($ms.GetBuffer(), 0, [int]$ms.Length)
      if ($s.StartsWith("{`"id`":$($script:id),")) { return $s }
    }
  }
  Send 'Emulation.setDeviceMetricsOverride' @{width = $Width; height = $Height; deviceScaleFactor = 1; mobile = $false} | Out-Null
  # wait until fonts and images are in and the timeline is built
  $ok = $false
  $check = "($Ready) && [...document.images].every(i => i.complete && i.naturalWidth > 0) && innerWidth === $Width && innerHeight === $Height"
  for ($i = 0; $i -lt 80 -and -not $ok; $i++) {
    Start-Sleep -Milliseconds 500
    $s = Send 'Runtime.evaluate' @{expression = $check; returnByValue = $true}
    $ok = $s -match '"value":true'
  }
  if (-not $ok) { throw "The page never became ready: $s" }
  $n0 = [int][math]::Round($Start * $Fps); $n1 = [int][math]::Round($End * $Fps)
  $sw = [Diagnostics.Stopwatch]::StartNew()
  for ($f = $n0; $f -lt $n1; $f++) {
    $t = [string]::Format([Globalization.CultureInfo]::InvariantCulture, '{0:0.#####}', $f / $Fps)
    Send 'Runtime.evaluate' @{expression = "$SeekFn($t); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(1))))"; awaitPromise = $true} | Out-Null
    $s = Send 'Page.captureScreenshot' @{format = 'png'}
    $a = $s.IndexOf('"data":"') + 8; $b = $s.IndexOf('"', $a)
    [IO.File]::WriteAllBytes((Join-Path $Out ('f_{0:00000}.png' -f $f)), [Convert]::FromBase64String($s.Substring($a, $b - $a)))
    if (($f - $n0) % 300 -eq 299) { Write-Output ("{0} / {1} frames, {2:0}s" -f ($f - $n0 + 1), ($n1 - $n0), $sw.Elapsed.TotalSeconds) }
  }
  Write-Output ("done: {0} frames in {1:0.0}s" -f ($n1 - $n0), $sw.Elapsed.TotalSeconds)
} finally {
  if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force }
}
