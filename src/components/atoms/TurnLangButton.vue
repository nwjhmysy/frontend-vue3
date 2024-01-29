<script setup lang="ts">
import { type Ref, inject } from 'vue';
import { LOCALES } from '@/constants'

const lang = inject<Ref<LOCALES>>('lang');
const updateLocale = inject<(arg0: LOCALES) => void>('updateLocale');
</script>
<template>
  <div
    class="w-12 h-12 text-center fixed top-32 right-10 bg-cyan-200 cursor-pointer"
    @click="
      () => {        
        if (lang === LOCALES.JA) {          
          updateLocale && updateLocale(LOCALES.ZH)
          return
        }
        if (lang === LOCALES.ZH) {
          updateLocale && updateLocale(LOCALES.JA)
          return
        }
      }
    "
  >
    切换语言
  </div>
</template>

<style scoped></style>
