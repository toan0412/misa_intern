<template>
  <v-btn class="enable-button text-none" :disabled="isDisabled"
    :style="{ backgroundColor: colors[buttonColor], color: colors[textColor] }">
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: "MSButton",
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    buttonColor: {
      type: String,
      default: 'primaryColor',
    },
    textColor: {
      type: String,
      default: 'white'
    }
  },
  data() {
    return {
      colors: {
        primaryColor: '#03ae66',
        white: '#ffffff',
        black: '#3d3f4e',
      }
    };
  },
};
</script>

<style scoped>
.enable-button {
  font-size: 13px;
  padding-left: 12px;
  padding-right: 12px;
  margin: 0 0 0 8px;
  height: 32px;
  border-radius: 4px;
  min-width: 96px;
  border: 1px solid var(--ms-border-button);
}

.v-btn__content {
  font-weight: 600 !important;
}

.enable-button:disabled {
  background-color: var(--ms-disable-background-button) !important;
  color: var(--ms-disable-text-button) !important;
  cursor: not-allowed;
}

.v-btn--variant-elevated {
  box-shadow: unset !important;
}
</style>
