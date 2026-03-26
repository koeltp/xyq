# 使用Nginx作为基础镜像
FROM nginx:alpine

# 复制所有必要的文件到nginx静态文件目录
COPY . /usr/share/nginx/html

# 创建必要的目录结构
RUN mkdir -p /usr/share/nginx/html/data

# 设置卷挂载点，让用户可以映射data目录
VOLUME ["/usr/share/nginx/html/data"]

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]