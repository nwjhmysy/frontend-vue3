import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LayoutVue from '@/components/layout/Layout.vue';
import { browserLocale } from '@/hooks/useLocale';
import { nextTick } from 'vue';

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
      meta: {
        
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home', params: { lang: browserLocale() } },
    },
  ],
});

router.beforeEach((to) => {
  const lang = to.params.lang || browserLocale();
  document.documentElement.lang = lang === 'ja' ? 'ja' : 'zh-CN';
});

router.afterEach((to) => {
  const lang = to.params['lang']
  nextTick(() => {
    
  })
})

export default router;
