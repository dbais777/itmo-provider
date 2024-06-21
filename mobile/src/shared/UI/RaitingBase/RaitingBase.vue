<template>
  <form class="rating" :class="{ disabled: disabled }">
    <div class="rating__stars">
      <input
        :id="'rating-' + item + random"
        class="rating__input"
        :class="'rating__input-' + item"
        type="radio"
        v-model="value"
        name="rating"
        :value="item"
        v-for="item in 5"
      />

      <label
        class="rating__label"
        v-for="item in 5"
        :for="'rating-' + item + random"
      >
        <svg
          class="rating__star"
          :width="props.size + 'em'"
          :height="props.size + 'em'"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <g transform="translate(16,16)">
            <circle
              class="rating__star-ring"
              fill="none"
              stroke="#FFCF48"
              stroke-width="16"
              r="8"
              transform="scale(0)"
            />
          </g>
          <g
            stroke="#FFCF48"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <g transform="translate(16,16) rotate(180)">
              <polygon
                class="rating__star-stroke"
                points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                fill="none"
              />
              <polygon
                class="rating__star-fill"
                points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                fill="#FFCF48"
              />
            </g>
            <g
              transform="translate(16,16)"
              stroke-dasharray="12 12"
              stroke-dashoffset="12"
            >
              <polyline
                class="rating__star-line"
                transform="rotate(0)"
                points="0 4,0 16"
              />
              <polyline
                class="rating__star-line"
                transform="rotate(72)"
                points="0 4,0 16"
              />
              <polyline
                class="rating__star-line"
                transform="rotate(144)"
                points="0 4,0 16"
              />
              <polyline
                class="rating__star-line"
                transform="rotate(216)"
                points="0 4,0 16"
              />
              <polyline
                class="rating__star-line"
                transform="rotate(288)"
                points="0 4,0 16"
              />
            </g>
          </g>
        </svg>
      </label>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
const random = Math.random();
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 1.6,
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

<style scoped lang="scss">
$hue: 223;
$starHue: 38;
.disabled {
  pointer-events: none;
}
input {
  visibility: hidden;
  display: none;
}
.rating {
  &__display {
    font-weight: 500;
    min-height: 1.25em;
    position: absolute;
    top: 100%;
    width: 100%;
    text-align: center;
  }
  &__stars {
    display: flex;

    position: relative;
  }
  &__star {
    display: block;
    overflow: visible;
    pointer-events: none;

    &-ring,
    &-fill,
    &-line,
    &-stroke {
      animation-duration: 1s;
      animation-timing-function: ease-in-out;
      animation-fill-mode: forwards;
    }
    &-ring,
    &-fill,
    &-line {
      stroke: var(--#FFCF48);
    }
    &-fill {
      fill: var(--#FFCF48);
      transform: scale(0);
      transition: fill var(--trans-dur) var(--bezier),
        transform var(--trans-dur) var(--bezier);
    }
    &-stroke {
      stroke: hsl($hue, 10%, 80%);
      transition: stroke var(--trans-dur);
    }
  }
  &__label {
    cursor: pointer;
    padding: 0.125em;
  }
  @for $s from 1 through 4 {
    &__label--delay#{$s} &__star-ring,
    &__label--delay#{$s} &__star-fill,
    &__label--delay#{$s} &__star-line,
    &__label--delay#{$s} &__star-stroke {
      animation-delay: 0.05s * $s;
    }
  }
  &__input {
    -webkit-appearance: none;
    appearance: none;
  }
  // display
  &__input:hover ~ [data-rating]:not([hidden]) {
    display: none;
  }

  &__input-1:hover ~ [data-rating="1"][hidden],
  &__input-2:hover ~ [data-rating="2"][hidden],
  &__input-3:hover ~ [data-rating="3"][hidden],
  &__input-4:hover ~ [data-rating="4"][hidden],
  &__input-5:hover ~ [data-rating="5"][hidden],
  &__input:checked:hover ~ [data-rating]:not([hidden]) {
    display: block;
  }
  // stars
  &__input-1:hover ~ &__label:first-of-type &__star-stroke,
  &__input-2:hover ~ &__label:nth-of-type(-n + 2) &__star-stroke,
  &__input-3:hover ~ &__label:nth-of-type(-n + 3) &__star-stroke,
  &__input-4:hover ~ &__label:nth-of-type(-n + 4) &__star-stroke,
  &__input-5:hover ~ &__label:nth-of-type(-n + 5) &__star-stroke {
    stroke: var(--#FFCF48);
    transform: scale(1);
  }
  &__input-1:checked ~ &__label:first-of-type &__star-ring,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-ring,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-ring,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-ring,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-ring {
    animation-name: starRing;
  }
  &__input-1:checked ~ &__label:first-of-type &__star-stroke,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-stroke,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-stroke,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-stroke,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-stroke {
    animation-name: starStroke;
  }
  &__input-1:checked ~ &__label:first-of-type &__star-line,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-line,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-line,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-line,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-line {
    animation-name: starLine;
  }
  &__input-1:checked ~ &__label:first-of-type &__star-fill,
  &__input-2:checked ~ &__label:nth-of-type(-n + 2) &__star-fill,
  &__input-3:checked ~ &__label:nth-of-type(-n + 3) &__star-fill,
  &__input-4:checked ~ &__label:nth-of-type(-n + 4) &__star-fill,
  &__input-5:checked ~ &__label:nth-of-type(-n + 5) &__star-fill {
    animation-name: starFill;
  }

  // screen reader text
  &__sr {
    clip: rect(1px, 1px, 1px, 1px);
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
  }
}

// Dark theme
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #{hsl($hue, 10%, 10%)};
    --fg: #{hsl($hue, 10%, 90%)};
  }
  .rating {
    &__star {
      &-stroke {
        stroke: hsl($hue, 10%, 30%);
      }
    }
  }
}

// Animations
@keyframes starRing {
  from,
  20% {
    animation-timing-function: ease-in;
    opacity: 1;
    r: 8px;
    stroke-width: 16px;
    transform: scale(0);
  }
  35% {
    animation-timing-function: ease-out;
    opacity: 0.5;
    r: 8px;
    stroke-width: 16px;
    transform: scale(1);
  }
  50%,
  to {
    opacity: 0;
    r: 16px;
    stroke-width: 0;
    transform: scale(1);
  }
}
@keyframes starFill {
  from,
  40% {
    animation-timing-function: ease-out;
    transform: scale(0);
  }
  60% {
    animation-timing-function: ease-in-out;
    transform: scale(1.2);
  }
  80% {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
@keyframes starStroke {
  from {
    transform: scale(1);
  }
  20%,
  to {
    transform: scale(0);
  }
}
@keyframes starLine {
  from,
  40% {
    animation-timing-function: ease-out;
    stroke-dasharray: 1 23;
    stroke-dashoffset: 1;
  }
  60%,
  to {
    stroke-dasharray: 12 12;
    stroke-dashoffset: -12;
  }
}
</style>
