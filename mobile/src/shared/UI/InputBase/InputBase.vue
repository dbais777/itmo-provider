<template>
  <div class="input-wrapper">
    <input v-bind="$attrs" class="input" type="text" v-model="value" />
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    // value.value = val;
    emit("update:modelValue", val);
  },
});
</script>

<style scoped>
.input-wrapper {
  padding: 8px;
}

.input {
  width: 100%;

  font-size: 20rem;
  border-radius: 10px;
  padding: 10px 20px;
  outline: none;
  background-color: #424242;
  border: none;
  color: #fff;
}
</style>
