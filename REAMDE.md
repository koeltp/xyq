# 逸武形意拳 - Docker 部署

## 目录结构

```
xingyiquan/
├── docker/
│   ├── nginx.conf           # Nginx 配置
│   ├── docker-compose.yml   # Docker Compose 编排
│   └── build-and-push.ps1   # 构建并推送镜像脚本
├── Dockerfile
├── .dockerignore
├── data/                    # 数据目录（不打包进镜像，通过 volume 挂载）
└── ...
```

## 本地运行

在 `docker/` 目录下执行：

```powershell
docker compose -f .\docker\docker-compose.yml up -d
```

访问 http://localhost:8080

## 构建并推送镜像

在 `docker/` 目录下执行：

```powershell
# 默认 latest 标签
.\build-and-push.ps1

# 指定版本标签
.\build-and-push.ps1 v1.2.0
```

## 注意事项

- `data/` 目录包含大量图片和视频，不打包进镜像，通过 docker-compose volume 挂载
- 所有 docker 命令均在 `docker/` 目录下执行
