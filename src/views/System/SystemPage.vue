<template>
  <div class="wrap">
    <!-- header -->
    <header class="view-header">
      <div class="view-header-item-wrap">
        <h1>Cán bộ, giáo viên</h1>
        <v-icon icon="mdi-help-circle-outline"></v-icon>
      </div>

      <div class="view-header-item-wrap">
        <v-icon icon="mdi-bell-outline" size="x-large"></v-icon>
        <div class="vertical-divider"></div>
        <p>Admin</p>
        <v-icon icon="mdi-chevron-down"></v-icon>
        <v-avatar image="https://randomuser.me/api/portraits/women/81.jpg"></v-avatar>
      </div>
    </header>

    <div class="divider"></div>

    <!-- content -->
    <div class="main-content">
      <div class="content-header">
        <div class="content-header-item">
          <v-text-field v-model="searchInput" append-inner-icon="mdi-magnify" density="compact" max-width="525px"
            label="Tìm kiếm" variant="solo" hide-details></v-text-field>
          <div class="content-header-item">
            <MSButton buttonColor="primaryColor" @click="showAddForm('-1')">Thêm</MSButton>
            <MSButton buttonColor="white" textColor="black">Xuất khẩu</MSButton>
            <IconButton icon="mdi-dots-horizontal"></IconButton>
          </div>
        </div>
      </div>

      <!-- table with skeleton loader -->
      <v-skeleton-loader v-if="loading" class="mx-auto" elevation="12" max-width="1800" type="table"></v-skeleton-loader>

      <!-- table -->
      <v-data-table v-else class="custom-table" :headers="headers" v-model="selected" :items="teachers" item-value="ID"
        show-select>
        <template v-slot:item.isTraining="{ item }">
          <v-icon v-if="item.isTraining">mdi-check</v-icon>
        </template>
        <template v-slot:item.isWorking="{ item }">
          <v-icon v-if="item.isWorking">mdi-check</v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="showAddForm(item.ID)">mdi-pencil-outline</v-icon>
          <v-icon small @click="showDeleteDialog(item.ID)">mdi-trash-can-outline</v-icon>
        </template>
      </v-data-table>

      <div>
        <yes-no-dialog ref="deleteDialog" message="Bạn có chắc chắn muốn xoá Cán bộ giáo viên đang chọn không?"
          @response="handleReponseDeleteDialog" />
        <yes-no-dialog ref="editDialog" message="Dữ liệu đã bị thay đổi, bạn có muốn lưu lại không?"
          @response="handleReponseEditDialog" />
        <AddNewTeacherForm ref="addNewTeacherForm" :currentTeacher="selectedTeacher" :nextId="nextId"
          @response="handleResponseAddForm" />
        <Toast ref="snackbar" />
      </div>
    </div>
  </div>
</template>

<script>
import MSButton from '@/components/button/MSButton.vue'
import IconButton from '@/components/button/IconButton.vue'
import { getAllTeachers, deleteTeacher, addTeacher, getATeacher, editTeacher, getNextId } from '@/services/TeachersServices'
import { defineAsyncComponent } from 'vue'
import Toast from '@/components/toast/Toast.vue'

export default {
  data: () => ({
    loading: true,
    selected: [],
    teachers: [],
    headers: [
      { title: 'Số hiệu cán bộ', value: 'ID', align: 'center' },
      { title: 'Họ và tên', key: 'FullName', sortable: false },
      { title: 'Số điện thoại', key: 'Phone', sortable: false },
      { title: 'Tổ chuyên môn', key: 'Department', sortable: false },
      { title: 'QL theo môn', key: 'DeviceManaged', sortable: false },
      { title: 'QL kho phòng', key: 'DepartmentManaged', sortable: false },
      { title: 'Đào tạo QLTB', key: 'isTraining', sortable: false },
      { title: 'Đang làm việc', key: 'isWorking', sortable: false },
      { title: '', key: 'actions', sortable: false }
    ],
    dialog: false,
    idSelected: null,
    selectedTeacher: {},
    searchInput: '',
    originalTeachers: [],
    nextId: ''
  }),
  mounted() {
    this.fetchTeachers();
  },
  methods: {
    //call api

    //Lấy danh sách giáo viên
    fetchTeachers() {
      getAllTeachers()
        .then((teachers) => {
          this.teachers = teachers
          this.originalTeachers = teachers
        })
        .finally(() => {
          this.loading = false;
        });

    },
    //Thêm 1 giáo viên
    addItem(newTeacher) {
      addTeacher(newTeacher)
        .then(() => {
          this.fetchTeachers();
          this.triggerSnackbar('success', 'Thành công', 'Thêm giảng viên thành công')
        })
        .catch((error) => {
          this.triggerSnackbar('error', 'Lỗi', 'Vui lòng nhập đầy đủ dữ liệu');
        });

    },
    //Lấy thông tin giáo viên theo ID
    getAItem(ID) {
      getATeacher(ID)
        .then((teacher) => {
          this.selectedTeacher = teacher[0];
        })
    },
    //Xóa 1 giáo viên theo ID
    deleteItem(ID) {
      deleteTeacher(ID)
        .then(() => {
          this.teachers = this.teachers.filter(teacher => teacher.ID !== ID);
          this.triggerSnackbar('success', 'Thành công', 'Xóa giảng viên thành công')
        })
    },
    //Cập nhật thông tin 1 giáo viên theo ID
    updateItem(ID, updatedTeacher) {
      editTeacher(ID, updatedTeacher)
        .then(() => {
          this.fetchTeachers();
          this.triggerSnackbar('success', 'Thành công', 'Sửa thông tin giảng viên thành công')
        })
        .catch((error) => {
          this.triggerSnackbar('error', 'Lỗi', 'Có lỗi xảy ra');
        });
    },
    //Lấy ID để thêm
    getNextIdItem() {
      getNextId()
        .then((res) => {
          this.nextId = res;
        })
    },

    //Hiển thị dialog cảnh báo xóa    
    showDeleteDialog(ID) {
      this.idSelected = ID;
      this.$refs.deleteDialog.openDialog();
    },
    //Hiển thị dialog cảnh báo sửa
    showEditDialog(editTeacher) {
      this.selectedTeacher = { ...editTeacher };
      this.$refs.editDialog.openDialog();
    },
    //Hiển thị form thêm giáo viên
    showAddForm(ID) {
      this.idSelected = ID;
      if (this.idSelected == '-1') {
        this.getNextIdItem()
      } else {
        this.getAItem(this.idSelected);
      }
      this.$refs.addNewTeacherForm.openDialog();
    },
    //Xử lý action trong dialog cảnh báo xóa
    handleReponseDeleteDialog(answer) {
      if (!answer) return
      this.deleteItem(this.idSelected)
      this.idSelected = null;
    },
    //Xử lý action trong dialog cảnh báo sửa
    handleReponseEditDialog(answer) {
      if (!answer) return
      console.log(this.selectedTeacher);
      this.updateItem(this.idSelected, this.selectedTeacher)
      this.idSelected = null;
    },

    //Xử lý action trong form thêm giáo viên
    handleResponseAddForm({ answer, newTeacher }) {
      if (!answer) return;
      if (this.idSelected == '-1') {
        //handle add
        this.addItem(newTeacher);
        this.idSelected = null;
      }
      else {
        //handle edit
        this.showEditDialog(newTeacher)
      }
    },

    //Hàm gọi Toast
    triggerSnackbar(type, title, message) {
      this.$refs.snackbar.showSnackbar(type, title, message);
    },

  },
  //Theo dõi searchInput
  watch: {
    searchInput(newInput, oldInput) {
      if (newInput.length > 0) {
        this.teachers = this.originalTeachers.filter(teacher =>
          teacher.FullName.toLowerCase().includes(newInput.toLowerCase())
        );
      } else {
        this.teachers = this.originalTeachers
      }
    }
  },


  components: {
    MSButton,
    IconButton,
    YesNoDialog: defineAsyncComponent(() =>
      import('@/components/toast/YesNoDialog.vue')
    ),
    AddNewTeacherForm: defineAsyncComponent(() =>
      import('./AddNewTeacherForm.vue')
    ),
    Toast
  }
}
</script>

<style lang="scss">
.wrap {
  margin: 0 12px;
}

.view-header {
  display: flex;
  padding: 8px 0;
  width: 100%;
  justify-content: space-between;
}

.view-header-item-wrap {
  display: flex;
  align-items: center;
}

.view-header-item-wrap h1 {
  font-weight: 400;
  font-size: 18px;
}

.view-header-item-wrap p {
  padding-left: 16px;
}

.view-header .v-icon {
  margin: 0 12px;
  color: #545454;
}

.v-badge__badge {
  inset: auto auto calc(100% - 16px) calc(100% - 28px) !important;
  background-color: #f95858;
}

.divider {
  text-align: center;
  margin: 0 -10px;
  height: 5px;
  background: linear-gradient(to bottom, #e0e0e0, white);
}

.vertical-divider {
  position: relative;
  width: 1px;
  height: 32px;
  background-color: #e0e0e0;
}

.content-header-item {
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-table {

  th,
  td {
    border-right: 1px solid #e0e0e0;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  thead {
    tr {
      th {
        height: 64px !important;
        background-color: var(--ms-header-gridpanel);
      }
    }

    .v-data-table-header__content {
      justify-content: center;
    }
  }

  tbody {

    .v-data-table__td:nth-child(3),
    .v-data-table__td:nth-child(8),
    .v-data-table__td:nth-child(9) {
      color: var(--ms-primary-color);
    }

    .v-data-table__td:nth-child(10) {
      .mdi-pencil-outline {
        color: #03ae66;
      }
    }

    tr {
      td {
        height: 40px !important;
      }
    }

  }



}
</style>