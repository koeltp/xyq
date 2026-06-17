# 形意归真 - 静态网站

形意拳武术馆官方网站，纯静态 HTML 站点。

## 项目结构

```
xingyiquan/
├── index.html                   # 首页
├── about.html                   # 关于形意拳
├── pricing.html                 # 收费表
├── videos.html                  # 教学视频
├── gallery.html                 # 照片墙
├── master.html                  # 师承介绍
├── contact.html                 # 联系我们
├── css/
│   ├── common.css               # 全局样式（导航、页脚、下拉菜单等）
│   ├── articles.css             # 文章页专用样式
│   └── ...
├── js/
│   └── navigation.js            # 导航交互（高亮、下拉、滚动效果）
├── images/
├── md/                          # 文章工作区
│   ├── 养生知识/                 # 按分类存放 MD 文件
│   ├── 防身技巧/
│   ├── 拳法解析/
│   ├── 学员故事/
│   ├── scripts/build-articles.js # 构建脚本
│   ├── templates/               # HTML 模板
│   │   ├── article.html         # 文章详情页模板
│   │   └── category.html       # 分类列表页模板
│   └── package.json
├── articles/                    # 构建产物（自动生成，勿手动编辑）
│   ├── yangsheng-zhishi/
│   │   ├── index.html           # 分类列表页
│   │   └── *.html               # 文章详情页
│   └── ...
├── docker/
│   ├── nginx.conf               # Nginx 配置
│   ├── docker-compose.yml       # Docker Compose 编排
│   └── build-and-push.ps1       # 构建并推送镜像脚本
├── Dockerfile
├── .dockerignore
└── data/                        # 数据目录（不打包进镜像，通过 volume 挂载）
```

## 文章系统

文章采用 Markdown 编写，通过构建脚本生成 HTML。

### 新增文章

1. 在 `md/` 对应分类目录下创建 `.md` 文件
2. 文件必须包含 frontmatter：

```markdown
---
title: 文章标题
date: 2026-06-15
category: 养生知识
summary: 文章摘要
author: 形意归真          # 可选，默认"形意归真"
slug: my-article-slug     # 可选，自定义 URL 文件名，不指定则自动生成拼音
---

正文内容...
```

3. 运行构建：`cd md && npm run build`
4. `articles/` 目录自动生成

### 分类列表

| 分类 | 拼音目录 |
|------|----------|
| 养生知识 | yangsheng-zhishi |
| 防身技巧 | fangshen-jiqiao |
| 拳法解析 | quanfa-jiexi |
| 学员故事 | xueyuan-gushi |

新增分类需在 `md/scripts/build-articles.js` 的 `CATEGORY_PINYIN_MAP` 中添加映射。

## 本地开发

```bash
# 安装文章构建依赖
cd md && npm install

# 构建文章
cd md && npm run build

# 本地预览（根目录执行）
npx http-server -p 8080
```

## Docker 部署

### 本地运行

```powershell
docker compose -f .\docker\docker-compose.yml up -d
```

访问 http://localhost:8080

### 构建并推送镜像

```powershell
# 默认 latest 标签（自动执行文章构建）
cd docker
.\build-and-push.ps1

# 指定版本标签
.\build-and-push.ps1 v1.2.0

# 或手动构建
cd md && npm run build
docker build -t xyq .
```

### 注意事项

- `data/` 目录包含大量图片和视频，不打包进镜像，通过 docker-compose volume 挂载
- `build-and-push.ps1` 会在 Docker 构建前自动执行 `npm run build` 生成文章 HTML
