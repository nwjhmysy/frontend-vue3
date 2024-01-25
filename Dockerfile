# # 使用 Node.js 的官方镜像
# FROM node:18

# # 设置工作目录
# WORKDIR /app

# # 复制 package.json 和 package-lock.json 文件
# # COPY package*.json ./

# # 指定 .dockerignore 文件以排除不需要的文件
# COPY .dockerignore .dockerignore

# # 将当前目录下的所有文件复制到工作目录
# COPY . .

# # 安装依赖
# RUN npm install

# # 构建生产环境代码
# RUN npm run build

# # 暴露容器端口
# EXPOSE 5173

# # 启动命令
# CMD ["npm", "run", "dev"]

# 基于 Node 镜像构建 Vite 项目
FROM node:18.18.2-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm config set registry https://registry.npmjs.org
RUN npm install

COPY . .
RUN npm run build

# 构建 Nginx 服务器并拷贝 Vite 项目的构建文件
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
