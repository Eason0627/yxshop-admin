<template>
  <div class="warehouse w-full h-full p-4 pb-32 overflow-y-auto">
    <div
      class="container w-full h-full mx-auto border-[.0625rem] rounded-md bg-white"
    >
      <Table
        ref="tableRef"
        :columns="columns"
        :table-data="tableData"
        :search-list="searchList"
        :page="page"
        :add-button-label="'新增仓库'"
        :form-fields="formFields"
        :loading="loading"
        :edit-method="editRow"
        :delete-method="deleteRow"
        :del-data="delData"
        :add-data="addData"
        @search="search"
        @reSet="reSet"
        @update-selection="updateSelection"
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

// 定义仓库类型
interface Warehouse {
  warehouse_id: string; // 更改为字符串类型
  warehouse_name: string;
  address: string;
  contact_info: string;
  total_capacity: number;
  current_capacity: number;
  manager_user_id: string; // 更改为字符串类型
  manager_user_name?: string;
  createTime: string;
  updateTime: string;
  status: number;
}

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
  prop: keyof Warehouse;
  type: string;
  width?: string;
}

const axios: AxiosInstance = inject("axios") as AxiosInstance;
const tableRef: any = ref("tableRef");
const dialogVisible = ref(false);
const dialogType = ref("");

// 对话框表单
const formFields = ref<FormField<any>[]>([
  {
    type: "text",
    label: "仓库名称",
    prop: "warehouse_name",
    placeholder: "请输入仓库名称",
    show: true,
    rules: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
    group: "基本信息", // 添加 group 属性
  },
  {
    type: "text",
    label: "仓库地址",
    prop: "address",
    placeholder: "请输入仓库地址",
    show: true,
    rules: [{ required: true, message: "请输入仓库地址", trigger: "blur" }],
    group: "基本信息", // 添加 group 属性
  },
  {
    type: "text",
    label: "联系信息",
    prop: "contact_info",
    placeholder: "请输入联系信息",
    show: true,
    rules: [{ required: true, message: "请输入联系信息", trigger: "blur" }],
    group: "基本信息", // 添加 group 属性
  },
  {
    type: "number",
    label: "仓库总容量",
    prop: "total_capacity",
    placeholder: "请输入仓库总容量",
    show: true,
    min: 0,
    rules: [{ required: false, message: "请输入仓库总容量", trigger: "blur" }],
    group: "仓库容量", // 添加 group 属性
  },
  {
    type: "number",
    label: "当前占用容量",
    prop: "current_capacity",
    placeholder: "请输入当前占用容量",
    show: true,
    min: 0,
    rules: [
      { required: false, message: "请输入当前占用容量", trigger: "blur" },
    ],
    group: "仓库容量", // 添加 group 属性
  },
  {
    type: "select",
    label: "仓库管理员",
    prop: "manager_user_id",
    placeholder: "请选择仓库管理员",
    show: true,
    group: "其他信息", // 添加 group 属性
    rules: [{ required: true, message: "请选择仓库管理员", trigger: "blur" }],
    onFocus: function (_value: any, field: FormField<any>) {
      // 获取当前登录用户
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      field.options = [
        {
          label: user.nick_name,
          value: user.id,
          id: user.id,
        },
      ];
    },
  },
  {
    type: "select",
    label: "仓库状态",
    prop: "status",
    placeholder: "请选择仓库状态",
    show: true,
    rules: [{ required: true, message: "请选择仓库状态", trigger: "blur" }],
    options: [
      { label: "未启用", value: 0 },
      { label: "正常", value: 1 },
      // 其他状态...
    ],
    group: "其他信息", // 添加 group 属性
  },
]);

// 搜索类型定义
const searchList = [
  {
    label: "仓库名称",
    value: "warehouse_name",
  },
  {
    label: "仓库地址",
    value: "address",
  },
  {
    label: "创建时间",
    value: "created_at",
  },
];

// 示例数据
const tableData = ref<Warehouse[]>([]);

// 表头定义
const columns: TableColumn[] = [
  {
    label: "仓库名称",
    prop: "warehouse_name",
    type: "default",
  },
  {
    label: "仓库地址",
    prop: "address",
    type: "default",
  },
  {
    label: "联系信息",
    prop: "contact_info",
    type: "default",
  },
  {
    label: "仓库管理员",
    prop: "manager_user_name",
    type: "default",
  },
  {
    label: "创建时间",
    prop: "createTime",
    type: "default",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    type: "default",
  },
  {
    label: "仓库状态",
    prop: "status",
    type: "status",
  },
];

// 分页信息
const page: PageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 勾选数据
const selectList = ref<Warehouse[]>([]);
// 点击编辑的数据
const editData = ref<Warehouse>();
// 构造查询对象
const queryParams = ref<SearchParams>({});
const loading = ref(false); // 加载状态

// 编辑行的方法
const editRow = (row: Warehouse) => {
  dialogType.value = "edit";
  dialogVisible.value = true;
  editData.value = { ...row };
  if (editData.value.manager_user_id && editData.value.manager_user_name) {
    const field = tableRef.value.formFields.find((item: any) => {
      return item.prop === "manager_user_id";
    });
    field.options = [
      {
        label: editData.value.manager_user_name,
        value: editData.value.manager_user_id,
        id: editData.value.manager_user_id,
      },
    ];
  }
};

// 删除行的方法
const deleteRow = async (row: Warehouse) => {
  try {
    await axios.delete(`/warehouse/${row.warehouse_id}`).then(async (res) => {
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
  const ids = selectList.value.map((item) => item.warehouse_id);
  try {
    await axios.post("/warehouse/delByIds", ids).then(async (res) => {
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
const updateSelection = (selectedRows: Warehouse[]) => {
  selectList.value = selectedRows;
};

// 数据上传
const handleFormSubmit = async (data: Warehouse) => {
  // 比较原始数据与新数据
  const hasChanges = compareObjects(editData.value, data);
  try {
    if (dialogType.value === "add") {
      console.log("新增仓库数据:", data);
      await axios.post("/warehouse", data).then(async (res) => {
        if (res.data.code === 200) {
          ElMessage.success("添加成功");
          await getTableData();
          dialogVisible.value = false;
        }
      });
    } else if (dialogType.value === "edit") {
      if (hasChanges) return ElMessage.warning("数据未发生改变");
      delete data.manager_user_name;
      await axios.put("/warehouse", data).then(async (res) => {
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
    warehouse: string;
    pageNum: number;
    pageSize: number;
    timeRange?: string; // 添加可选的 timeRange 属性
  } = {
    warehouse:
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
    const response = await axios.get("/warehouse", { params });

    if (response.data.code === 200) {
      const records = response.data.data.records;
      await Promise.all(
        records.map(async (item: Warehouse) => {
          await axios.get("/users/" + item.manager_user_id).then((res) => {
            if (res.data.code == 200) {
              item.manager_user_name = res.data.data.nick_name;
            }
          });
        })
      );
      tableData.value = records;
      page.total = response.data.data.total;
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
