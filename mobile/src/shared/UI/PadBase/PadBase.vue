<template>
  <div class="container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.container {
  background: var(--color2);
  border: 1px solid #505050;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
}
</style>
