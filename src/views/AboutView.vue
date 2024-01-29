<script lang="ts" setup>
import { LOCALES } from '@/constants';
import { inject, type Ref, computed } from 'vue';
import TEST_VALUE from '@/model/test';

const lang = inject<Ref<LOCALES>>('lang');
const updateLocale = inject<(arg0: LOCALES) => void>('updateLocale');

const value = computed(() => {
  const key = lang?.value || LOCALES.ZH;
  return TEST_VALUE[key];
});
</script>

<template>
  <div class="about">
    <h1>{{ value.title }}</h1>
    <ul>
      <li v-for="(val, index) in value.list" :key="'about_' + index">{{ val }}</li>
    </ul>
    <strong>{{ lang }}</strong>
    <br />
    <button @click="() => updateLocale && updateLocale(LOCALES.JA)">ja</button>
    <br />
    <button @click="() => updateLocale && updateLocale(LOCALES.ZH)">zh</button>
  </div>
</template>

<style scoped></style>
