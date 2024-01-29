<script setup lang="ts">
import { LOCALES } from '@/constants';
import { browserLocale, useLocale } from '@/hooks/useLocale';
import { provide, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Footer from './Footer.vue';
import TurnLangButton from '../atoms/TurnLangButton.vue';

const router = useRouter();
const route = useRoute();
// 切换路由时更新 lang
const { lang, updateLocale } = useLocale((route.params['lang'] as LOCALES | undefined) || browserLocale());

// 改变语言 lang 时，改变路由
watch(lang, (val) => {
  router.push({ params: { lang: val } });
});

provide('lang', lang);
provide('updateLocale', updateLocale);
</script>

<template>
  <div class="flex flex-col justify-start relative">
    <div class="w-full bg-slate-400">
      <!-- nav -->
      <div class="w-full bg-slate-500">nav</div>
      <!-- content -->
      <div class="w-full h-[100vh] box-border p-2 bg-red-200">
        <div class="w-full">
          <router-view />
        </div>
      </div>
    </div>
    <!-- footer -->
    <Footer />
    <TurnLangButton />
  </div>
</template>

<style scoped></style>
