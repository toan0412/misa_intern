<template>
  <div class="wrap">
    <v-dialog v-model="dialog" max-width="1022px" class="custom_dialog">
      <v-card>
        <div class="avatar_input">
          <div class="avatar_wrap">
            <v-img :width="150" aspect-ratio="16/9"
              src="https://media.istockphoto.com/id/517998264/vector/male-user-icon.jpg?s=612x612&w=0&k=20&c=4RMhqIXcJMcFkRJPq6K8h7ozuUoZhPwKniEke6KYa_k="></v-img>
          </div>
          <div class="text-h7 generate_name">{{ newTeacher.fullName || 'Họ và tên' }}</div>
          <div class="text-subtitle-1 genarate_id">{{ newTeacher.id || 'SHCB' }}</div>
        </div>

        <v-card width="800px">
          <v-card-title>
            <span class="headline">Thêm hồ sơ Cán bộ, giáo viên</span>
          </v-card-title>
          <v-card-text>
            <v-container>   <div class="header-item"></div>
              <v-row class="my-5 ">
                <v-col cols="2" class="py-0">
                  <label>Số hiệu cán bộ</label>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field v-model="newTeacher.id" variant="outlined" dense :disabled="true"></v-text-field>
                </v-col>
                <v-col cols="2" class="py-0">
                  <label>Họ và tên</label>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field v-model="newTeacher.fullName" variant="outlined" dense
                    :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>

              <v-row class="my-5">
                <v-col cols="2" class="py-0">
                  <label>Số điện thoại</label>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field v-model="newTeacher.phone" variant="outlined" dense
                    :rules="[rules.required, rules.phone]"></v-text-field>
                </v-col>
                <v-col cols="2" class="py-0">
                  <label>Email</label>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field variant="outlined" dense></v-text-field>
                </v-col>
              </v-row>

              <v-row class="my-5">
                <v-col cols="2" class="py-0">
                  <label>Tổ bộ môn</label>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select v-model="newTeacher.department" dense variant="outlined"
                    :items="['Tổ Toán - Tin', 'Tổ Lý', 'Tổ Hóa - Sinh', 'Tổ Anh - Văn']"></v-select>
                </v-col>
                <v-col cols="2" class="py-0">
                  <label>QL theo môn</label>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select v-model="newTeacher.deviceManaged" dense variant="outlined"
                    :items="['Toán', 'Anh', 'Văn', 'Lý', 'Hóa']" multiple>
                  </v-select>
                </v-col>
              </v-row>

              <v-row class="my-5">
                <v-col cols="2" class="py-0">
                  <label>QL kho, phòng</label>
                </v-col>
                <v-col cols="10" class="py-0">
                  <v-select v-model="newTeacher.departmentManaged" dense variant="outlined"
                    :items="['Phòng tin học', 'Phòng hóa - sinh', 'Kho thiết bị chung', 'Phòng lý']" multiple>
                  </v-select>
                </v-col>
              </v-row>

              <v-row class="my-5">
                <v-col cols="4" class="py-0">
                  <v-checkbox v-model="newTeacher.isTraining" label="Trình độ nghiệp vụ QLTB"></v-checkbox>
                </v-col>
                <v-col cols="3" class="py-0">
                  <v-checkbox v-model="newTeacher.isWorking" label="Đang làm việc"></v-checkbox>
                </v-col>
                <v-col cols="5" class="py-0" v-if="!newTeacher.isWorking">
                  <div class="date-picker-container">
                    <div class="text-body-1 ">Ngày nghỉ việc </div>
                    <v-date-input class="date-picker-input" variant="outlined" dense hide-details></v-date-input>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <MSButton buttonColor="white" textColor="black" text @click="respond(false)">Đóng</MSButton>
            <MSButton text @click="respond(true)">Lưu</MSButton>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import MSButton from '@/components/button/MSButton.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default {
  name: 'AddNewTeacherForm',
  data() {
    return {
      dialog: false,
      newTeacher: {
        id: '',
        fullName: '',
        phone: '',
        department: '',
        deviceManaged: [],
        departmentManaged: [],
        isTraining: false,
        isWorking: false,
      },
      rules: {
        required: value => !!value || 'Trường này không được để trống',
        phone: value => {
          const phoneRegex = /^[0-9]{10}$/;
          return phoneRegex.test(value) || 'Số điện thoại không đúng định dạng';
        },
      },
    };
  },

  props: {
    currentTeacher: Object,
    nextId: String,
  },

  watch: {
    currentTeacher: {
      handler(editTeacher) {
        if (editTeacher && Object.keys(editTeacher).length > 0) {
          this.newTeacher.id = editTeacher.ID
          this.newTeacher.fullName = editTeacher.FullName
          this.newTeacher.phone = editTeacher.Phone
          this.newTeacher.department = editTeacher.Department
          this.newTeacher.deviceManaged = editTeacher.DeviceManaged
          this.newTeacher.departmentManaged = editTeacher.DepartmentManaged
          this.newTeacher.isTraining = editTeacher.isTraining
          this.newTeacher.isWorking = editTeacher.isWorking
        }
      },
      immediate: true
    },

    nextId: {
      handler(newVal) {
        this.newTeacher.id = newVal
      },
      immediate: true
    }
  },

  methods: {
    openDialog() {
      this.dialog = true;
    },

    respond(answer) {
      this.dialog = false;
      this.$emit('response', { answer, newTeacher: this.newTeacher });
      this.resetForm()
    },
    resetForm() {
      this.newTeacher.fullName = ''
      this.newTeacher.phone = ''
      this.newTeacher.department = ''
      this.newTeacher.deviceManaged = []
      this.newTeacher.departmentManaged = []
      this.newTeacher.isTraining = false
      this.newTeacher.isWorking = false
    }
  },
  components: {
    MSButton,
    VDateInput
  }
};
</script>

<style lang="scss">
.v-overlay__content {
  .mdi-checkbox-marked {
    color: var(--ms-primary-color) !important;
  }

  .v-list-item--active {
    .v-list-item__overlay {
      background: var(--ms-white) !important;
    }
  }
}

.v-list-item__content {
  .v-list-item-title {
    font-size: 13px !important;
  }
}

.select_single {
  .v-list-item--active {
    .v-list-item__overlay {
      background: var(--ms-primary-color) !important;
    }
  }
}



.custom_dialog {
  display: flex;

  .avatar_input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 36px;

    .generate_name,
    .genarate_id {
      display: flex;
      justify-content: center;
    }
  }

  .v-card {
    flex-direction: row !important;
  }

  .v-card-title {
    display: flex;
    align-items: center;
    height: 52px;
  }

  .v-container,
  .v-card-text {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }

  .v-row {
    display: flex;
    margin: 4px 0 !important;
    font-size: 13px;
    color: #4d4f5c;

    .v-col {
      padding: 4px
    }

    .v-col:nth-child(1) {
      margin-top: 8px;
    }

    .v-col:nth-child(3) {
      margin-top: 8px;
      padding-left: 20px;
    }
  }

  .v-row:nth-child(5) {
    .v-col:nth-child(1) {
      margin-top: 0 !important;
    }
  }

  .headline {
    margin-left: 8px;
    margin-top: 4px;
    padding-bottom: 0;
  }

  .v-card-actions {
    padding-top: 0;
    padding-bottom: 12px;
    margin-right: 22px;
  }


  .v-field__field {
    height: 32px;
  }

  .v-field__append-inner {
    padding-top: 4px !important;
  }

  .v-field__input {
    min-height: 30px !important;
    height: 30px;
    font-size: 13px;
  }

  .v-select--selected {
    .v-field__input {
      padding-top: 6px;
    }
  }

  .v-label--clickable {
    font-size: 13px;
    opacity: 1 !important;
    color: black;
  }

  .v-select__selection-text {
    font-size: 13px;
  }

  .v-input__details {
    padding: 6px 6px;
  }

  .date-picker-container {
    display: flex;
    position: relative;
    align-items: center;

    .text-body-1 {
      font-size: 13px !important;
      padding-top: 6px;
      color: #4d4f5c;
      padding-right: 12px;
    }

    .v-input__control {
      height: 32px
    }


    .v-input__prepend {
      position: absolute !important;
      right: -10px !important;
      bottom: 4px !important;
      color: var(--ms-primary-color);
    }

    .v-field--no-label {
      --v-field-padding-top: -10px !important;
    }
  }
}
</style>
