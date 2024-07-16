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

      <!-- table -->
      <v-data-table class="custom-table" :headers="headers" v-model="selected" :items="teachers" :items-per-page="12"
        item-value="ID" show-select>
        <template v-slot:item.isTraining="{ item }">
          <v-icon v-if="item.isTraining">mdi-check</v-icon>
        </template>
        <template v-slot:item.isWorking="{ item }">
          <v-icon v-if="item.isWorking">mdi-check</v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="showAddForm(item.ID)">mdi-pencil-outline</v-icon>
          <v-icon small @click="showDialog(item.ID)">mdi-trash-can-outline</v-icon>
        </template>
      </v-data-table>
      <div>
        <yes-no-dialog ref="yesNoDialog" title="Thông báo"
          message="Bạn có chắc chắn muốn xoá Cán bộ giáo viên đang chọn không?" @response="handleResponseDialog" />
        <AddNewTeacherForm ref="addNewTeacherForm" :currentTeacher="selectedTeacher" :nextId="nextId"
          @response="handleResponseAddForm" />
      </div>
    </div>
  </div>
</template>

<script>
import MSButton from '@/components/button/MSButton.vue'
import IconButton from '@/components/button/IconButton.vue'
import { getAllTeachers, deleteTeacher, addTeacher, getATeacher, editTeacher, getNextId } from '@/services/TeachersServices'
import { defineAsyncComponent } from 'vue'

export default {
  data: () => ({
    selected: [],
    teachers: [],
    headers: [
      { title: 'Số hiệu cán bộ', value: 'ID' },
      { title: 'Họ và tên', key: 'FullName' },
      { title: 'Số điện thoại', key: 'Phone' },
      { title: 'Tổ chuyên môn', key: 'Department' },
      { title: 'QL theo môn', key: 'DeviceManaged' },
      { title: 'QL kho phòng', key: 'DepartmentManaged' },
      { title: 'Đào tạo QLTB', key: 'isTraining' },
      { title: 'Đang làm việc', key: 'isWorking' },
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
    },
    //Thêm 1 giáo viên
    addItem(newTeacher) {
      addTeacher(newTeacher)
        .then(() => {
          this.fetchTeachers();
        })
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
        })
    },
    //Cập nhật thông tin 1 giáo viên theo ID
    updateItem(ID, updatedTeacher) {
      editTeacher(ID, updatedTeacher)
        .then(() => {
          this.fetchTeachers();
        })
    },
    //Lấy ID để thêm
    getNextIdItem() {
      getNextId()
        .then((res) => {
          this.nextId = res;
        })
    },

    //Hiển thị dialog cảnh báo xóa    
    showDialog(ID) {
      this.idSelected = ID;
      this.$refs.yesNoDialog.openDialog();
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
    //Xử lý action trong dialog cảnh báo
    handleResponseDialog(answer) {
      if (answer) {
        this.deleteItem(this.idSelected)
        this.idSelected = null;
      }
    },
    //Xử lý action trong form thêm giáo viên
    handleResponseAddForm({ answer, newTeacher }) {
      if (answer) {
        if (this.idSelected == '-1') {
          //handle add
          this.addItem(newTeacher);
          this.idSelected = null;
        }
        else {
          //handle edit
          this.updateItem(this.idSelected, newTeacher)
        }
      }
    }
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
    background-color: #eaecef;
  }

  .v-data-table-header__content {
    color: black;
  }

  .v-data-table__td:nth-child(3),
  .v-data-table__td:nth-child(8),
  .v-data-table__td:nth-child(9) {
    color: #03ae66;
  }

  .v-data-table__td:nth-child(10) {
    .mdi-pencil-outline {
      color: #03ae66;
    }
  }

  .v-data-table-footer {
    justify-content: flex-start;
    margin-left: 12px;
  }
}
</style>