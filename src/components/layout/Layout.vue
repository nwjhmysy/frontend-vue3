<script setup lang="ts"></script>

<template>
  <div class="flex flex-col justify-start">
    <div class="w-full bg-slate-400">
      <div class="w-full bg-slate-500">nav</div>
      <div class="w-full box-border p-2 bg-red-200">
        <div class="w-full">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
    <div class="w-full h-14 bg-black">footer</div>
  </div>
</template>

<style scoped></style>
