<template>
  <div class="cupertino-pane">
    <slot name="header" />
    <div class="content">
      <slot v-if="isOpen" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { CupertinoPane } from "cupertino-pane";

let myPane;

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  settings: {
    type: Object,
    default: {
      backdrop: true,
      initialBreak: "bottom",
      fitScreenHeight: true,
      bottomClose: false,
      draggableOver: false,
      breaks: {
        top: {
          enabled: false, // Enable or disable breakpoint
          bounce: false,

        },
        middle: {
          enabled: false, // Enable or disable breakpoint
          bounce: false,
        },
        bottom: {
          enabled: true, // Enable or disable breakpoint
          height: window.screen.height / 1.5, // Pane breakpoint height
          bounce: false,
        },
      },
    },
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

watch(isOpen, (value) => {
  if (value) {
    init();
    return;
  }

  if (!value) {
    destroy();
    return;
  }
});

const init = () => {
  myPane = new CupertinoPane(".cupertino-pane", props.settings);

  if (myPane) {
    myPane.present({ animate: true });
  }
  myPane.on("onDidDismiss", (ev) => {
    emit("update:modelValue", false);
  });
  myPane.on("onBackdropTap", (ev) => {
    emit("update:modelValue", false);
  });

  isOpen.value = true;
};

const destroy = async () => {
  myPane.destroy({ animate: true });
  isOpen.value = false;
};
</script>

<style lang="scss">
.cupertino-pane {
  margin: 20px;
  margin-top: 40px;
  margin-bottom: 20px;
}

:root {
  --cupertino-pane-background: #262626;
  --cupertino-pane-color: none;
}
</style>
