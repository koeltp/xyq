# Build and push Docker image to Alibaba Cloud Container Registry
# Usage: ./build-and-push.ps1 [version tag]
# Example: ./build-and-push.ps1          (default: latest)
#          ./build-and-push.ps1 v1.2.0

param(
    [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"

$registry = "registry.cn-shenzhen.aliyuncs.com"
$namespace = "tmd"
$imageName = "xyq"
$fullImageName = "${registry}/${namespace}/${imageName}:${Tag}"

# Project root (script is under docker/, go one level up to build)
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  XingYiQuan - Docker Build & Release" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Image: ${fullImageName}" -ForegroundColor Yellow
Write-Host "Path:  ${projectRoot}" -ForegroundColor Yellow
Write-Host ""

# Login
Write-Host "[1/4] Logging in to Alibaba Cloud ACR..." -ForegroundColor Green
docker login $registry
if ($LASTEXITCODE -ne 0) {
    Write-Host "Login failed" -ForegroundColor Red
    exit 1
}
Write-Host "Login successful" -ForegroundColor Green
Write-Host ""

# Build articles from Markdown
Write-Host "[2/4] Building MD articles..." -ForegroundColor Green
Push-Location (Join-Path $projectRoot "md")
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Dependency install failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Article build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "Article build successful" -ForegroundColor Green
Write-Host ""

# Build Docker image
Write-Host "[3/4] Building Docker image..." -ForegroundColor Green
docker build -t $fullImageName -f "$projectRoot/Dockerfile" $projectRoot
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful" -ForegroundColor Green
Write-Host ""

# Push
# Write-Host "[4/4] Pushing image to ACR..." -ForegroundColor Green
# docker push $fullImageName
# if ($LASTEXITCODE -ne 0) {
#     Write-Host "Push failed" -ForegroundColor Red
#     exit 1
# }
# Write-Host "Push successful" -ForegroundColor Green
# Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Release complete!" -ForegroundColor Cyan
Write-Host "  Image: ${fullImageName}" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
