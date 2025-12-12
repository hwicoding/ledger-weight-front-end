# Node 프로세스 확인 스크립트 (한글 깨짐 방지)
# UTF-8 인코딩 설정
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "`n=== Node Processes ===" -ForegroundColor Cyan
Write-Host ""

$processes = Get-Process -Name node -ErrorAction SilentlyContinue

if ($processes) {
    $processes | Select-Object Id, ProcessName, @{
        Name='StartTime'
        Expression={$_.StartTime.ToString('yyyy-MM-dd HH:mm:ss')}
    } | Format-Table -AutoSize
    
    Write-Host "Total: $($processes.Count) node processes" -ForegroundColor Yellow
} else {
    Write-Host "No node processes found" -ForegroundColor Yellow
}

Write-Host ""

