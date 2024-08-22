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
            label="Tìm kiếm" variant="outlined" hide-details></v-text-field>
          <div class="content-header-item">
            <MSButton buttonColor="primaryColor" @click="showAddForm('-1')">Thêm</MSButton>
            <MSButton buttonColor="white" textColor="black">Xuất khẩu</MSButton>
            <IconButton icon="mdi-dots-horizontal"></IconButton>
          </div>
        </div>
      </div>

      <!-- table with skeleton loader -->
      <v-skeleton-loader v-if="loading" class="mx-auto" max-width="1800" type="table"></v-skeleton-loader>

      <!-- table -->
      <v-data-table v-else class="custom-table" :headers="headers" :items="teachers" v-model="selected"
        :show-current-page="true" :items-per-page="30" fixed-header show-select item-value="ID" hide-default-footer>
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

      <!-- custom footer -->
      <div class="footer-actions">
        <IconButton class="footer-actions__button" icon="mdi-page-first" @click="goToFirstPage"></IconButton>
        <IconButton class="footer-actions__button" icon="mdi-chevron-left" @click="previousPage"></IconButton>
        <input v-model="currentPage" class="footer-actions__input" max-width="30px" />
        <IconButton class="footer-actions__button" icon="mdi-chevron-right" @click="nextPage"></IconButton>
        <IconButton class="footer-actions__button" icon="mdi-page-last" @click="goToLastPage"></IconButton>
        <div class="footer-actions__info footer-actions__info--page-count">{{ currentPage }}/{{ pageCount }} trang</div>
        <div class="footer-actions__info footer-actions__info--teacher-count">({{ teacherCount }} giáo viên)</div>
      </div>


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
import { getAllTeachers, deleteTeacher, addTeacher, getATeacher, editTeacher, getNextId, getLimitTeachers, getTeacherBySearch } from '@/services/TeachersServices'
import { defineAsyncComponent } from 'vue'
import debounce from 'lodash.debounce'

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
    nextId: '',
    currentPage: 1,
    pageCount: 1,
    teacherCount: 0,

  }),

  created() {
    this.loadData();
  },
  methods: {
    //call api
    //Lấy danh sách giáo viên
    loadData() {
      this.fetchTeachers();
      this.getTeacherCount();
    },

    fetchTeachers() {
      if (!parseInt(this.currentPage)) return
      if (this.currentPage < 0) return
      this.loading = true;
      const offset = (this.currentPage - 1) * 30;
      getLimitTeachers(30, offset)
        .then((teachers) => {
          this.teachers = teachers
        })
        .finally(() => {
          this.loading = false;
        });
    },

    //Lấy tổng bản ghi
    getTeacherCount() {
      getAllTeachers()
        .then((res) => {
          this.teacherCount = res.totalRecords;
          this.pageCount = Math.ceil(this.teacherCount / 30)
        })
    },

    //Tìm kiếm giáo viên
    searchTeacher(data) {
      this.currentPage = 1
      getTeacherBySearch(data)
        .then((res) => {
          this.teachers = res.teachers;
          this.teacherCount = res.totalRecords;
          this.pageCount = Math.ceil(this.teacherCount / 30)
        })
    },

    //debounce search
    debouncedSearchTeacher: debounce(function (data) {
      this.searchTeacher(data);
    }, 300),

    //Thêm 1 giáo viên
    addItem(newTeacher) {
      addTeacher(newTeacher)
        .then(() => {
          this.fetchTeachers();
          this.getTeacherCount();
          this.triggerSnackbar('success', 'Thành công', 'Thêm giảng viên thành công')
        })
        .catch((error) => {
          console.log(error)
          this.triggerSnackbar('error', 'Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
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
          this.fetchTeachers();
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

    //Action footer
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    goToFirstPage() {
      if (this.currentPage > 1) {
        this.currentPage = 1;
      }
    },
    goToLastPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage = this.pageCount;
      }
    },

  },
  //Theo dõi searchInput
  watch: {
    searchInput(newInput) {
      if (newInput.length > 0) {
        this.debouncedSearchTeacher(newInput);
      } else {
        this.fetchTeachers();
        this.getTeacherCount();
      }
    },
    currentPage(newPage) {
      if (newPage > this.pageCount || newPage < 1) return
      this.fetchTeachers();
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
    Toast: defineAsyncComponent(() =>
      import('@/components/toast/Toast.vue')
    ),
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
  max-height: 750px;

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
        background-color: var(--ms-header-gridpanel) !important;
        font-size: 13px !important;
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
        font-size: 13px;

      }
    }

  }
}

/* Footer */
.footer-actions {
  display: flex;
  padding-top: 12px;
  align-items: center;
  box-shadow: 0 -4px 8px #e0e0e0;

  .footer-actions__button {
    border: 0;
  }

  .footer-actions__input {
    margin-left: 8px;
    width: 70px;
    height: 36px;
    border: 1px solid #cecece;
    border-radius: 4px;
    padding: 0 30px;
  }

  .footer-actions__info {
    padding-left: 16px;
    color: var(--ms-text-color);
  }
}
</style>