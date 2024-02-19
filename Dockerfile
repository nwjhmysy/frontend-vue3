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
COPY --from=builder /app/key /ssl
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
