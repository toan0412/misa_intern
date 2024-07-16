<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <MSButton buttonColor="white" textColor="black" text @click="respond(false)">Đóng</MSButton>
        <MSButton text @click="respond(true)">Đồng ý</MSButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MSButton from '../button/MSButton.vue'

export default {
  name: 'YesNoDialog',
  props: {
    title: {
      type: String,
      default: 'Confirm'
    },
    message: {
      type: String,
      default: 'Are you sure?'
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    respond(answer) {
      this.dialog = false;
      this.$emit('response', answer);
    }
  },
  components: {
    MSButton
  }
};
</script>

<style>
.headline {
  color: #4d4f5c;
  margin-left: 8px;
  margin-top: 4px;
  padding-bottom: 0;
}

.v-card-actions {
  padding-top: 0;
  padding-bottom: 12px;
  margin-right: 22px;
}
</style>
