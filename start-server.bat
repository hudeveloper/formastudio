@echo off
title forma studio. - Local 3D Web Server
echo ===================================================
echo   forma studio. - Luxury 3D Website Launcher
echo ===================================================
echo.
echo Opening website in your default browser...
start "" "%~dp0index.html"
echo.
echo Website opened directly! If your browser requires a local HTTP server,
echo running built-in Windows web server on http://localhost:3000 ...
echo Press Ctrl+C to stop.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:3000/'); $listener.Start(); Write-Host 'Server running at http://localhost:3000/'; Start-Process 'http://localhost:3000/'; while ($listener.IsListening) { $context = $listener.GetContext(); $req = $context.Request; $res = $context.Response; $path = Join-Path (Get-Location) ($req.Url.LocalPath.TrimStart('/')); if (-not (Test-Path $path) -or (Get-Item $path).PSIsContainer) { $path = Join-Path (Get-Location) 'index.html' }; $bytes = [System.IO.File]::ReadAllBytes($path); $ext = [System.IO.Path]::GetExtension($path).ToLower(); switch ($ext) { '.html' { $res.ContentType = 'text/html' } '.css' { $res.ContentType = 'text/css' } '.js' { $res.ContentType = 'application/javascript' } '.png' { $res.ContentType = 'image/png' } '.jpg' { $res.ContentType = 'image/jpeg' } default { $res.ContentType = 'application/octet-stream' } }; $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length); $res.OutputStream.Close() }"
pause

