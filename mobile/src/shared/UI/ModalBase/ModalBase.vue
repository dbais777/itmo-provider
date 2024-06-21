<template>
  <Transition>
    <teleport to="body">
      <div class="wrapper" @click.self="close">
        <div class="modal">
          <div class="modal__container">
            <div class="modal__title">
              {{ props.modalTitle }}
              <img
                src="@/shared/assets/img/icons/close.svg"
                class="close"
                @click="close"
              />
            </div>
            <HrBase />
          </div>

          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </teleport>
  </Transition>
</template>

<script setup>
import { HrBase } from "@/shared/UI/HrBase";
const close = () => {
  emits("close");
};

const emits = defineEmits(["close"]);

const props = defineProps({
  modalTitle: {
    type: String,
    default: "modalTitle",
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  background: rgba(0, 0, 0, 0.195);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}
.close {
  padding: 4px;
}
.modal {
  width: 100%;
  max-height: 70vh;
  background: #1f1f1f;
  border: 0.5px solid #3c3c3c;
  border-radius: 10px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0 1 auto;
  }
  &__body {
    overflow: auto;
    flex: 0 1 auto;
  }
  &__container {
    flex: 1 0 auto;
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
