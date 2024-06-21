<template>
  <div class="toggle">
    <input v-model="value" type="checkbox" :id="id" />
    <label :for="id" />
  </div>
</template>

<script setup>
import { computed } from "vue";
const id = Math.random();
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  set(val) {
    emit("update:modelValue", val);
  },
  get() {
    return props.modelValue;
  },
});
</script>

<style lang="scss" scoped>
.toggle {
  --toggle-width: 50px;
  --toggle-height: 30px;
  --toggle-offset: 2px;

  --toggle-outer-default: #ddd;
  --toggle-outer-active: #1c89f0;
  --toggle-inner-default: #fff;
  --toggle-inner-active: #fff;

  --toggle-transition: 200ms ease-out;
}

.toggle input {
  display: none;
}

.toggle label {
  position: relative;
  display: inline-flex;
  align-items: center;

  width: var(--toggle-width);
  height: var(--toggle-height);

  background-color: var(--toggle-outer-default);
  border-radius: 100vw;

  cursor: pointer;
  transition: var(--toggle-transition);
}

.toggle input:checked + label {
  background-color: var(--toggle-outer-active);
}

.toggle label::before {
  content: "";
  position: absolute;
  top: var(--toggle-offset);
  left: var(--toggle-offset);
  bottom: var(--toggle-offset);

  aspect-ratio: 1 / 1;

  background-color: var(--toggle-inner-default);
  border-radius: 50%;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
  transition: var(--toggle-transition);
}

.toggle input:checked + label::before {
  background-color: var(--toggle-inner-active);
  transform: translateX(calc(var(--toggle-width) - var(--toggle-height)));
}

/* general reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  font: inherit;
}
</style>
