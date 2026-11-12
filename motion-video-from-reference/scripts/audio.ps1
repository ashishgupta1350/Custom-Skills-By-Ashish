param(
  [Parameter(Mandatory = $true)][string]$Html,   # full path to the video's HTML file
  [Parameter(Mandatory = $true)][string]$Out,    # WAV file to write
  [string]$Expr = 'sfxWav()',                    # page expression resolving to a base64 WAV
  [int]$Port = 9334
)
# Renders the page's synthesised sound-effects track in headless Chrome and saves it as a WAV.
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
$p = Start-Process $browser -PassThru -ArgumentList @('--headless=new', "--remote-debugging-port=$Port", '--remote-allow-origins=*', "--user-data-dir=`"$prof`"", '--no-first-run', '--mute-audio', "`"$url`"")
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
  $msg = @{id = 1; method = 'Runtime.evaluate'; params = @{expression = $Expr; awaitPromise = $true; returnByValue = $true}} | ConvertTo-Json -Depth 4 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
  Start-Sleep -Seconds 2
  $ws.SendAsync((New-Object 'System.ArraySegment[byte]' -ArgumentList @(, $bytes)), 'Text', $true, $ct).Wait()
  do { $r = $ws.ReceiveAsync($seg, $ct).Result; $ms.Write($buf, 0, $r.Count) } while (-not $r.EndOfMessage)
  $s = [Text.Encoding]::UTF8.GetString($ms.GetBuffer(), 0, [int]$ms.Length)
  $k = $s.IndexOf('"value":"')
  if ($k -lt 0) { throw ('No audio returned: ' + $s.Substring(0, [math]::Min(600, $s.Length))) }
  $a = $k + 9; $b = $s.IndexOf('"', $a)
  [IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($s.Substring($a, $b - $a)))
  Write-Output ("wrote {0} ({1:0.0} MB)" -f $Out, ((Get-Item $Out).Length / 1MB))
} finally {
  if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force }
}
