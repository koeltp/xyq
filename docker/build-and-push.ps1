# 构建并推送Docker镜像到阿里云容器镜像服务

# 设置变量
$registry = "registry.cn-shenzhen.aliyuncs.com"
$namespace = "tmd"
$imageName = "xyq"
$tag = "latest"
$fullImageName = "${registry}/${namespace}/${imageName}:${tag}"

Write-Host "开始登录阿里云容器镜像服务..."

# 登录阿里云容器镜像服务
try {
    docker login ${registry}
    if ($LASTEXITCODE -ne 0) {
        throw "登录失败"
    }
    Write-Host "✅ 登录成功"
} catch {
    Write-Host "❌ 登录失败: $_"
    Write-Host "提示: 请确保输入正确的阿里云账号和密码"
    exit 1
}

Write-Host "开始构建Docker镜像..."

# 构建Docker镜像
try {
    # 进入项目根目录执行构建
    docker build -t ${imageName} -f docker/Dockerfile .
    if ($LASTEXITCODE -ne 0) {
        throw "构建镜像失败"
    }
    Write-Host "✅ 镜像构建成功"
} catch {
    Write-Host "❌ 构建失败: $_"
    exit 1
}

Write-Host "开始打标签..."

# 打标签
try {
    docker tag ${imageName} ${fullImageName}
    if ($LASTEXITCODE -ne 0) {
        throw "打标签失败"
    }
    Write-Host "✅ 标签设置成功"
} catch {
    Write-Host "❌ 打标签失败: $_"
    exit 1
}

Write-Host "开始推送镜像到阿里云..."

# 推送镜像
try {
    docker push ${fullImageName}
    if ($LASTEXITCODE -ne 0) {
        throw "推送失败"
    }
    Write-Host "✅ 镜像推送成功"
    Write-Host "📦 镜像地址: ${fullImageName}"
} catch {
    Write-Host "❌ 推送失败: $_"
    Write-Host "提示: 请确保已登录阿里云容器镜像服务，可使用 'docker login ${registry}' 命令登录"
    exit 1
}

Write-Host "🎉 构建和推送完成！"
