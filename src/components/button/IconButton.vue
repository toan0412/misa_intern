<template>
  <v-btn v-bind="$attrs" :disabled="disabled" class="icon-button" :color="disabled ? 'e0e0e0' : 'ffffff'"
    :style="{ color: disabled ? 'a6a6a6' : '#3d3f4e' }">
    <v-icon v-if="icon" :size="iconSize" :color="disabled ? 'a6a6a6' : '#3d3f4e'">
      {{ icon }}
    </v-icon>
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'IconButton',
  props: {
    icon: {
      type: String,
      default: null
    },
    iconSize: {
      type: String,
      default: '24px'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.icon-button {
  font-size: 14px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #cecece;
  padding: 0;
  margin: 0 0 0 8px;
  height: 32px;
  border-radius: 4px;
  color: var(--ms-text-color);
  min-width: 36px;
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