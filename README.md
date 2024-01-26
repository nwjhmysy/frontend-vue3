### 1.创建应用

创建

```
npm create vue@latest
```

按照流程进行安装

### 2.安装`tailwind`

#### `Install Tailwind CSS`

安装并初始化配置文件

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

#### `PostCSS configuration`

`postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

#### `Configure your template paths`

`tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### `Add the Tailwind to your CSS`

`style.css`

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3.安装`prepare`

格式化代码工具

安装

```
npm i prettier
```

格式化规则

`.prettierrc`

```
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 120
}
```

忽略规则

`.prettierignore`

```
// 例如
src/services/*
src/stories/*
```

命令

```
"format": "prettier -w src/*.{ts,vue} && prettier -w src/**/*.{ts,vue}",
```

### 4.使用`docker`

使用`docker`镜像——`node:18.18.2-alpine`打包项目

再将项目`copy`到`nginx:alpine`镜像

`Dockerfile`

```dockerfile
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
```

`docker-compose.yml`

```yml
version: '3'

services:
  nginx:
    image: yinsiyu/frontend-vue3
    container_name: myvue3
    ports:
      - "8080:80"
    restart: always
```

`Makefile`

```makefile
build-dev-image:
	docker build --platform=linux/amd64 -t yinsiyu/frontend-vue3 .

docker-run:
	docker-compose up -d

docker-down:
	docker-compose down

docker-push:
	docker push yinsiyu/frontend-vue3:latest
```

`nginx.conf`

```
# nginx.conf

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /usr/share/nginx/html;
        index index.html index.htm;

        location / {
            try_files $uri $uri/ /index.html;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

