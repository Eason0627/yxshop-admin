<template>
  <div class="coupon w-full h-full p-4 pb-32 overflow-y-auto">
    <div
      class="container w-full h-full mx-auto border-[.0625rem] rounded-md bg-white"
    >
      <Table
        :columns="columns"
        :table-data="tableData"
        :search-list="searchList"
        :page="page"
        :add-button-label="'新增'"
        :edit-button-label="'审核'"
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

// 定义优惠券类型
interface Process {
  process_id: string;
  process_type: string;
  application_id: string;
  user_name: string;
  effect_id?: string;
  effect_schema: string;
  reviewer_id: string;
  reviewer_name: string;
  application_date: string | Date;
  review_date: string | Date;
  remark: string;
  status: number|boolean;
  description: string;
  create_time: string;
  update_time: string;
}

// 定义搜索参数
interface SearchParams {
  searchType?: string;
  searchText?: string;
  userRole?: string;
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
  prop: keyof Process;
  type: string;
  width?: string;
}

const axios: AxiosInstance = inject("axios") as AxiosInstance;

const dialogVisible = ref(false);
const dialogType = ref("");

// 对话框表单
const formFields = ref<FormField<any>[]>([
  {
    type: "select",
    label: "审核状态",
    prop: "status",
    // tips:'是废旧我',
    options: [{"label":'审核通过',"value":'审核通过'},{"label":'待审核',"value":'待审核'},{"label":'审核拒绝',"value":'审核拒绝'}],
    loading: false,
    show: true,
  },
  {
    type: "textarea",
    label: "审核备注",
    prop: "remark",
    placeholder: "请输入审核备注/意见",
    show: true,
    // rules: [{ required: true, message: "请输入审核备注", trigger: "blur" }],
  },
]);

// 搜索类型定义
const searchList = [
  {
    label: "审核类型",
    value: "process_type",
  },
  {
    label: "审核创建时间",
    value: "create_time",
  },
  
];

// 示例数据
const tableData = ref<Process[]>([]);

// 表头定义
const columns: TableColumn[] = [
  {
    label: "审核类型",
    prop: "process_type",
    type: "tag",
    width: "",
  },
  {
    label: "申请人",
    prop: "user_name",
    type: "tag",
    width: "",
  },
  {
    label: "审核提交时间",
    prop: "application_date",
    type: "default",
    width: "",
  },
  {
    label: "申请说明",
    prop: "description",
    type: "default",
    width: "",
  },
  {
    label: "审核状态",
    prop: "status",
    type: "tag",
    width: "",
  },
  {
    label: "创建时间",
    prop: "create_time",
    type: "default",
    width: "",
  },
  {
    label: "更新时间",
    prop: "update_time",
    type: "default",
    width: "",
  },
];

// 分页信息
const page: PageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 勾选数据
const selectList = ref<Process[]>([]);
// 点击编辑的数据
const editData = ref<Process>();

// 获取当前用户权限（什么类型的用户）
const userRole = JSON.parse(localStorage.getItem("user") || "{}").role;
console.log("userRole", userRole);
// 构造查询对象
const queryParams = ref<SearchParams>({});
const loading = ref(false); // 加载状态

// 编辑行的方法
const editRow = (row: Process) => {
  console.log("编辑行:", row);
  dialogType.value = "edit";
  dialogVisible.value = true;
  editData.value = { ...row };
};

// 删除行的方法
const deleteRow = async (row: Process) => {
  try {
    await axios.delete(`/process/${row.process_id}`).then(async (res) => {
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
  const ids = selectList.value.map((item) => item.process_id);
  try {
    await axios.post("/process/batch", ids).then(async (res) => {
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
const updateSelection = (selectedRows: Process[]) => {
  selectList.value = selectedRows;
};

// 数据上传
const handleFormSubmit = async (data: Process) => {
  // console.log('data', data);
  
  // 获取type_id
  // if (!data.type_id) {
  //   let option = formFields.value[0].options?.find((item) => {
  //     return item.value === data.type_name;
  //   });
  //   data.type_id = option?.id as string;
  // }
  
  // 比较原始数据与新数据
  const hasChanges = compareObjects(editData.value, data);

  try {
    
    if (dialogType.value === "add") {
      console.log("新增优惠券数据:", data);
      
      await axios.post("/process", data).then(async (res) => {
        if (res.data.code === 200) {
          ElMessage.success("添加成功");
          await getTableData();
          dialogVisible.value = false;
        }
      });
    } else if (dialogType.value === "edit") {
      if (hasChanges) return ElMessage.warning("数据未发生改变");
     console.log('data', data);
     
      await axios.put("/process", data).then(async (res) => {
        if (res.data.code === 200||res.data===true) {
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




//获取数据
const getTableData = async (time?: string) => {
  loading.value = true;
  tableData.value = [];
  let params: {
    process: string;
    userRole: string;
    pageNum: number;
    pageSize: number;
    timeRange?: string; // 添加可选的 timeRange 属性
  } = {
    process:
      JSON.stringify(queryParams.value) === "{}"
        ? ""
        : JSON.stringify(queryParams.value),
    userRole: userRole,
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
    const response = await axios.get("/process", { params });
    console.log("返回数据:", response);
    if (response.data.code === 200) {
      const records = response.data.data.records;
      // console.log(1)
      // 使用 Promise.all 等待所有异步请求完成
      await Promise.all(
        records.map(async (item: Process) => {
          // console.log(2)
          try {
            const res = await axios.get(`/process/getApplicantName/${item.application_id}`);
            item.user_name = res.data.data;
          } catch (e) {
            // 处理单个请求的错误
            console.error(
              `Failed to fetch type_name for type_id ${item.application_id}:`,
              e
            );
            item.user_name = ""; // 或者设置一个默认值
          }
          // console.log(3)
          // 格式化日期
          // item.start_date = item.start_date.toString().split("T")[0];
          // item.end_date = item.end_date.toString().split("T")[0];
          // // 将applicable_items 字符串转换为数组
          // item.applicable_items = JSON.parse(item.applicable_items);
        })
      );

      tableData.value = records;
      console.log("tableData", tableData.value);
      
      page.total = parseInt(response.data.data.total);
      // console.log("page", page.total);
      
      loading.value = false;
    } else {
      console.log("获取数据为空数据");
      ElMessage.warning("获取数据为空数据");
      tableData.value = [];
      page.total = 0;
      loading.value = false;
    }
  } catch (e: any) {
    ElMessage.error("获取数据失败 :"+e);
    console.log(e);
    
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await getTableData();
});

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return a === b;
}
// 比较两个对象是否相同
function compareObjects(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function convertToCustomFormat(dateString: string | number | Date) {
    // 创建一个 Date 对象
    const date = new Date(dateString);

    // 获取年、月、日、时、分、秒
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1
    const day = ('0' + date.getUTCDate()).slice(-2);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds()).slice(-2);

    // 构造新的日期时间字符串
    const formattedString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedString;
}

function convertToCustomFormat2(isoString: string | number | Date) {
    // 创建一个 Date 对象
    const date = new Date(isoString);

    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    // 构造新的日期时间字符串
    const formattedString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedString;
}
</script>
