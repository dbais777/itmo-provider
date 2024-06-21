<template>
  <button class="select__wrapper" @click="isActive = !isActive">
    {{ list.filter((el) => el.value === current)[0]?.title }}
    <div
      class="select__dropdown"
      ref="dropdownListREF"
      :class="{ isActive: isActive }"
    >
      <button
        class="select__dropdown-list"
        @click="emit('choose', item.value)"
        v-for="item in list"
      >
        {{ item.title }}
      </button>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.select {
  &__wrapper {
    background: #ffffff;
    border-radius: 8px;
    padding: 8px 28px;
    color: #2d2d2d;
    font-weight: 400;

    border: none;
    position: relative;
    min-width: 140px;
  }
  &__dropdown {
    background: #ffffff;
    border-radius: 8px;
    padding: 3px;
    position: absolute;
    display: flex;
    flex-direction: column;

    height: fit-content;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    transform: translateY(-10px);
    &.isActive {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      z-index: 10;
    }
  }

  &__dropdown-list {
    border: none;
    background: inherit;
    transition: all 0.3s;
    &:hover {
      background: #bababa;
    }
    padding: 10px 0;
    border-bottom: 1px solid rgb(174, 174, 174);
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>

<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

defineProps({
  list: {
    type: Array,
    required: true,
  },
  current: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["choose"]);

const isActive = ref(false);
const dropdownListREF = ref(null);
onClickOutside(dropdownListREF, () => (isActive.value = false));
</script>
