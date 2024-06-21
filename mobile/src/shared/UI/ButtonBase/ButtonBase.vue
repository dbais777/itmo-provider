<template>
  <button class="button" :class="{ yellow: style === 'danger' }">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  style: {
    type: String,
    default: "common",
  },
});
</script>

<style lang="scss" scoped>
.button {
  border-radius: 5px;
  padding: 8px 14px;
  border: none;

  color: #000000;
  background: #e1e1e1;
}
</style>
