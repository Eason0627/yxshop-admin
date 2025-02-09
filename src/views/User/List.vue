<template>
  <div class="user-list w-full h-full p-4 pb-32 overflow-y-auto">
    <div
      class="container w-full h-full mx-auto border-[.0625rem] rounded-md bg-white"
    >
      <Table
        :columns="columns"
        :table-data="tableData"
        :search-list="searchList"
        :page="page"
        :add-button-label="'新增用户'"
        :form-fields="formFields"
        :loading="loading"
        :edit-method="editRow"
        :delete-method="deleteRow"
        :del-data="delData"
        :add-data="addData"
        @search="search"
        @reSet="reSet"
        @update-selection="updateSelection"
        @upload-change="handleUploadChange"
        @handle-submit="handleFormSubmit"
      ></Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, reactive, ref } from "vue";
import Table from "@/components/Table/Table.vue";
import { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";
import { FormField } from "@/components/Dialog/FormField";
import User from "@/model/User";

// 定义搜索参数
interface SearchParams {
  searchType?: string;
  searchText?: string;
  time?: [string, string];
}

// 定义分页信息
interface PageInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

// 定义表格列
interface TableColumn {
  label: string;
  prop: keyof User;
  type: string;
  width?: string;
}

const axios: AxiosInstance = inject("axios") as AxiosInstance;

const dialogVisible = ref(false);
const dialogType = ref("");

// 对话框表单
const formFields = ref<FormField<any>[]>([
  {
    type: "uploader",
    label: "头像",
    prop: "avatar",
    placeholder: "请输入头像链接",
    uploadConfig: {
      uploadAction: "/upload",
      multiple: false,
      limit: 1,
    },
    group: "基本信息",
    show: true,
  },
  {
    type: "text",
    label: "用户名",
    prop: "username",
    placeholder: "请输入用户名",
    group: "基本信息",
    show: true,
    rules: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  },
  {
    type: "text",
    label: "昵称",
    prop: "nick_name",
    placeholder: "请输入昵称",
    group: "基本信息",
    show: true,
    rules: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  },
  {
    type: "text",
    label: "电子邮件",
    prop: "email",
    placeholder: "请输入电子邮件",
    group: "联系方式",
    show: true,
    rules: [{ required: true, message: "请输入电子邮件", trigger: "blur" }],
  },
  {
    type: "text",
    label: "手机号码",
    prop: "phone",
    placeholder: "请输入手机号码",
    group: "联系方式",
    show: true,
    rules: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  },
  {
    type: "text",
    label: "微信号",
    prop: "wechat_id",
    placeholder: "请输入微信号",
    group: "联系方式",
    show: true,
  },
  {
    type: "text",
    label: "真实姓名",
    prop: "real_name",
    placeholder: "请输入真实姓名",
    group: "隐私信息",
    show: true,
    rules: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  },
  {
    type: "text",
    label: "身份证号",
    prop: "id_card",
    placeholder: "请输入身份证号码",
    group: "隐私信息",
    show: true,
  },
  {
    type: "select",
    label: "性别",
    prop: "gender",
    placeholder: "请选择性别",
    options: [
      {
        label: "男",
        value: "Male",
      },
      {
        label: "女",
        value: "Female",
      },
    ],
    group: "隐私信息",
    show: true,
  },
  {
    type: "datetime",
    label: "生日",
    prop: "birth",
    placeholder: "请选择生日",
    group: "隐私信息",
    show: true,
  },
  {
    type: "text",
    label: "默认地址",
    prop: "default_address",
    placeholder: "请输入默认地址",
    group: "隐私信息",
    show: true,
  },
  {
    type: "select",
    label: "状态",
    prop: "status",
    placeholder: "请选择状态",
    options: [
      {
        label: "正常",
        value: "Active",
      },
      {
        label: "封禁",
        value: "Inactive",
      },
      {
        label: "已注销",
        value: "Invalid",
      },
    ],
    group: "其它信息",
    show: true,
  },
  {
    type: "select",
    label: "角色",
    prop: "role",
    placeholder: "请选择角色",
    options: [
      { label: "普通用户", value: "Customer" },
      { label: "店铺管理员", value: "ShopOwner" },
      { label: "超级管理员", value: "Admin" },
    ],
    group: "其它信息",
    show: true,
  },
]);

// 搜索类型定义
const searchList: any[] = [
  {
    label: "用户名",
    value: "username",
  },
  {
    label: "邮箱",
    value: "email",
  },
  {
    label: "昵称",
    value: "nick_name",
  },
  {
    label: "真实姓名",
    value: "real_name",
  },
  {
    label: "手机号码",
    value: "phone",
  },
  {
    label: "微信号",
    value: "wechat_id",
  },
];

// 示例数据
const tableData = ref<User[]>([]);

// 表头定义
const columns: TableColumn[] = [
  {
    label: "头像",
    prop: "avatar",
    type: "image",
    width: "120px",
  },
  {
    label: "昵称",
    prop: "nick_name",
    type: "text",
    width: "120px",
  },
  {
    label: "手机号码",
    prop: "phone",
    type: "text",
    width: "120px",
  },
  {
    label: "微信号",
    prop: "wechat_id",
    type: "text",
    width: "120px",
  },
  {
    label: "性别",
    prop: "gender",
    type: "sex",
    width: "120px",
  },
  {
    label: "默认收货地址",
    prop: "default_address",
    type: "text",
    width: "120px",
  },
  {
    label: "状态",
    prop: "status",
    type: "user_status",
    width: "120px",
  },
  {
    label: "角色",
    prop: "role",
    type: "role",
    width: "120px",
  },
  {
    label: "是否实名",
    prop: "is_verified",
    type: "judge",
    width: "120px",
  },
  {
    label: "创建时间",
    prop: "createTime",
    type: "default",
    width: "200px",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    type: "default",
    width: "200px",
  },
];

// 分页信息
const page: PageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 勾选数据
const selectList = ref<User[]>([]);
// 点击编辑的数据
const editData = ref<User>();
// 构造查询对象
const queryParams = ref<SearchParams>({});
const loading = ref(false); // 加载状态

// 编辑行的方法
const editRow = (row: User) => {
  dialogType.value = "edit";
  dialogVisible.value = true;
  editData.value = { ...row };
};

// 删除行的方法
const deleteRow = async (row: User) => {
  try {
    await axios.delete(`/users/${row.id}`).then(async (res) => {
      if (res.data.code === 200) {
        await getTableData();
        dialogVisible.value = false;
      }
    });
  } catch (e) {
    ElMessage.error("删除失败: " + e);
  }
};

// 删除所选行的方法
const delData = async () => {
  if (!selectList.value.length) {
    return ElMessage.warning("请先选择要删除的数据");
  }
  const ids = selectList.value.map((item) => item.id);
  try {
    await axios
      .delete(`/users/deleteUsers`, { data: { ids } })
      .then(async (res) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          await getTableData();
          dialogVisible.value = false;
        }
      });
  } catch (e) {
    ElMessage.error("批量删除失败: " + e);
  }
};

// 新增行的方法
const addData = () => {
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 监听搜索条件更新
const search = async (searchParams: SearchParams) => {
  if (!searchParams) {
    return ElMessage.warning("请先选择搜索条件");
  }
  if (searchParams.searchType && searchParams.searchText) {
    queryParams.value = {
      ...queryParams.value,
      [searchParams.searchType]: searchParams.searchText,
    };
  }
  if (searchParams.time && searchParams.time[0] && searchParams.time[1]) {
    const timeRange = `${searchParams.time[0]},${searchParams.time[1]}`;
    await getTableData(timeRange);
  } else {
    await getTableData();
  }
};

// 重置搜索数据
const reSet = async () => {
  queryParams.value = {};
  await getTableData();
};

// 监听选中数据更新
const updateSelection = (selectedRows: User[]) => {
  selectList.value = selectedRows;
};

// 图片上传回调
const handleUploadChange = (file: any, _fileList: any) => {
  editData.value!.avatar = file.raw;
};

// 数据上传
const handleFormSubmit = async (data: User) => {
  if (data.id_card) {
    data.is_verified = 1;
  }
  // 构建 FormData 对象
  const formData = new FormData();
  // @ts-ignore
  if (data.avatar && data.avatar.raw) {
    // @ts-ignore
    formData.append("avatar", data.avatar.raw);
  }
  formData.append("data", JSON.stringify(data));
  try {
    if (dialogType.value === "add") {
      await axios
        .post("/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          if (res.data.code === 200) {
            ElMessage.success("添加成功");
            await getTableData();
            dialogVisible.value = false;
          }
        });
    } else if (dialogType.value === "edit") {
      await axios
        .put(`/users/${data.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          if (res.data.code === 200) {
            ElMessage.success("更新完成");
            await getTableData();
            dialogVisible.value = false;
          }
        });
    }
  } catch (e) {
    ElMessage.error("提交失败: " + e);
    dialogVisible.value = false;
  }
};

const getTableData = async (time?: string) => {
  loading.value = true;
  tableData.value = [];
  let params: {
    user: string;
    pageNum: number;
    pageSize: number;
    timeRange?: string; // 添加可选的 timeRange 属性
  } = {
    user:
      JSON.stringify(queryParams.value) === "{}"
        ? ""
        : JSON.stringify(queryParams.value),
    pageNum: page.currentPage,
    pageSize: page.pageSize,
  };

  if (time) {
    params = {
      ...params,
      timeRange: time,
    };
  }

  try {
    const response = await axios.get(`/users/getPagination`, { params });

    if (response.data.code === 200) {
      const { total, list } = response.data.data;
      console.log(list);

      tableData.value = list;
      page.total = total;
      loading.value = false;
    } else {
      tableData.value = [];
      page.total = 0;
      loading.value = false;
    }
  } catch (e: any) {
    ElMessage.error("获取数据失败 ");
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await getTableData();
});

// 比较两个对象是否相同
function compareObjects(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
</script>
