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

### 5.静态资源实施思路（双语言版）

#### 整体思路

每个页面都可以获取语言类型的索引

改变语言种类时路由改变

改变路由中的语言类型参数时页面获取的索引也改变

根据语言类型索引拿到所需的静态资源

#### 静态资源结构

```
model
	- XXX
		- index.ts
		- XXX_zh.ts
		- XXX.ja.ts
		- type.ts
```

`index.ts`

```tsx
const test:Record<LOCALES,xxx> = {
  zh: xxx_zh,
  ja: xxx_ja,
}
```

通过语言索引获取对应的静态资源

#### 语言切换（SPA）

在`Layout.vue`中将`lang`（语言索引）和`updateLocale`存入`provide`中

`Layout.vue`：

将路由和`ref`双向绑定

```tsx
// 切换路由时,更新 lang
const { lang, updateLocale } = useLocale((route.params['lang'] as LOCALES | undefined) || browserLocale());

// 改变语言 lang 时,改变路由
watch(lang, (val) => {
  router.push({ params: { lang: val } });
});
```

#### 在页面中的使用（例）

```tsx
const lang = inject<Ref<LOCALES>>('lang');
const updateLocale = inject<(arg0: LOCALES) => void>('updateLocale');

const value = computed(() => {
  const key = lang?.value || LOCALES.ZH;
  return TEST_VALUE[key];
});
```

#### 切换`meta`

创建`meta`静态资源

在`/router/index.ts`中获取`meta`资源

`getMeta(route)`

```tsx
const getMeta = (route: RouteLocationNormalizedLoaded) => {
  const lang = route.params.lang as LOCALES || LOCALES.ZH;
  const meta = META_VALUE[lang];
  const metaKey = route.name ? route.name?.toString() : 'common';

  return meta[metaKey] || meta['common'];
};
```

在`router.afterEach()`方法中修改标签

使用`nextTick()`方法

`nextTick()`: DOM 更新循环结束后执行回调函数

```tsx
router.afterEach((to) => {
  // nextTick(): DOM 更新循环结束后执行回调函数
  nextTick(() => {
    // 为 HTML 添加 meta
    const meta = getMeta(to);

    // 添加 tittle：
    document.title = meta.title;
    document.querySelector('meta[name=description]')?.remove();

    // 添加 meta：
    // 查找已存在的 meta[name=viewport] 元素
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    // 创建新的 meta 元素
    const descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    descriptionMeta.setAttribute('content', meta.description);
    // 插入到 viewportMeta 元素之后
    viewportMeta?.parentNode?.insertBefore(descriptionMeta, viewportMeta.nextSibling);
  });
});
```

