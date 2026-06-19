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

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  XingYiQuan - Docker Build & Release" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Image: ${fullImageName}" -ForegroundColor Yellow
Write-Host "Path:  ${projectRoot}" -ForegroundColor Yellow
Write-Host ""

# Step 1: Install dependencies & build articles (in md/ directory)
Write-Host "[1/3] Building articles from Markdown..." -ForegroundColor Green
Push-Location (Join-Path $projectRoot "md")
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm install failed" -ForegroundColor Red
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
Write-Host "Articles built successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Login to ACR
Write-Host "[2/3] Logging in to Alibaba Cloud ACR..." -ForegroundColor Green
docker login $registry
if ($LASTEXITCODE -ne 0) {
    Write-Host "Login failed" -ForegroundColor Red
    exit 1
}
Write-Host "Login successful" -ForegroundColor Green
Write-Host ""

# Step 3: Build Docker image
Write-Host "[3/3] Building Docker image..." -ForegroundColor Green
docker build -t $fullImageName -f "$projectRoot/Dockerfile" $projectRoot
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Docker build successful" -ForegroundColor Green
Write-Host ""

# Push (uncomment when ready)
# Write-Host "[5/5] Pushing image to ACR..." -ForegroundColor Green
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