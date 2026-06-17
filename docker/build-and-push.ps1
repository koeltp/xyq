# 构建并推送 Docker 镜像到阿里云容器镜像服务
# 用法: ./build-and-push.ps1 [版本标签]
# 示例: ./build-and-push.ps1          (默认 latest)
#        ./build-and-push.ps1 v1.2.0

param(
    [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"

$registry = "registry.cn-shenzhen.aliyuncs.com"
$namespace = "tmd"
$imageName = "xyq"
$fullImageName = "${registry}/${namespace}/${imageName}:${Tag}"

# 项目根目录（脚本在 docker/ 下，需回到上级目录构建）
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  逸武形意拳 - Docker 镜像构建发布" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "镜像: ${fullImageName}" -ForegroundColor Yellow
Write-Host "目录: ${projectRoot}" -ForegroundColor Yellow
Write-Host ""

# 登录
Write-Host "[1/4] 登录阿里云容器镜像服务..." -ForegroundColor Green
docker login $registry
if ($LASTEXITCODE -ne 0) {
    Write-Host "登录失败" -ForegroundColor Red
    exit 1
}
Write-Host "登录成功" -ForegroundColor Green
Write-Host ""

# 构建文章
Write-Host "[2/4] 构建 MD 文章..." -ForegroundColor Green
Push-Location (Join-Path $projectRoot "md")
if (-not (Test-Path "node_modules")) {
    Write-Host "  安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "依赖安装失败" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "文章构建失败" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "文章构建成功" -ForegroundColor Green
Write-Host ""

# 构建
Write-Host "[3/4] 构建 Docker 镜像..." -ForegroundColor Green
docker build -t $fullImageName -f "$projectRoot/Dockerfile" $projectRoot
if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "构建成功" -ForegroundColor Green
Write-Host ""

# 推送
# Write-Host "[4/4] 推送镜像到阿里云..." -ForegroundColor Green
# docker push $fullImageName
# if ($LASTEXITCODE -ne 0) {
#     Write-Host "推送失败" -ForegroundColor Red
#     exit 1
# }
# Write-Host "推送成功" -ForegroundColor Green
# Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  发布完成！" -ForegroundColor Cyan
Write-Host "  镜像地址: ${fullImageName}" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
