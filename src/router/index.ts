import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded, type Router } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LayoutVue from '@/components/layout/Layout.vue';
import { browserLocale } from '@/hooks/useLocale';
import { nextTick } from 'vue';
import META_VALUE from '@/model/meta';
import { LOCALES } from '@/constants';

const getMeta = (route: RouteLocationNormalizedLoaded) => {
  const lang = (route.params.lang as LOCALES) || LOCALES.ZH;
  const meta = META_VALUE[lang];
  const metaKey = route.name ? route.name?.toString() : 'common';

  return meta[metaKey] || meta['common'];
};

const routes = [
  {
    path: '',
    name: 'home',
    component: HomeView,
  },
  {
    path: 'about',
    name: 'about',
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:lang(zh|ja)?',
      component: LayoutVue,
      children: routes,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home', params: { lang: browserLocale() } },
    },
  ],
});

// 调整 HTML 语言类型
router.beforeEach((to) => {
  const lang = to.params.lang || browserLocale();
  document.documentElement.lang = lang === 'ja' ? 'ja' : 'zh-CN';
});

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

export default router;
