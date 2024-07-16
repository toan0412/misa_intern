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
    textColor:{
      type: String,
      default: 'white'
    }
  },
  data() {
    return {
      colors: {
        primaryColor: '#03ae66',
        red: '#ff0000',
        blue: '#0000ff',
        white: '#ffffff',
        black: '#000000',
        gray: '#e0e0e0'
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.enable-button {
  font-size: 14px;
  padding-left: 12px;
  padding-right: 12px;
  margin: 0 0 0 8px;
  height: 32px;
  border-radius: 4px;
  min-width: 96px;
}

.enable-button:disabled {
  background-color: #e0e0e0 !important;
  color: #a6a6a6 !important;
  cursor: not-allowed;
}
</style>
