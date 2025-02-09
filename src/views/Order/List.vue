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
        :add-button-label="'新增订单'"
        :edit-button-label="'修改'"
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
import { log } from "console";

// 定义优惠券类型
interface OrderInfo {
  order_id: string;//订单唯一标识符，主键
  customer_id: string;//下单客户的用户ID，作为外键引用User表
  customer_name: string;//下单客户姓名
  shop_id: string;//店铺ID，作为外键引用Shop表
  shop_name: string;// 所属店��名称
  product_id?: string;// 下单商品的ID，作为外键引用Product表
  product_name: string;// 下单商品名称
  quantity: number;//下单数量
  order_total: number;// 订单总额
  freight: string | number;//运费险
  disbursements: string | number;//实际付款
  integral: number;//积分
  payment_method: string;//支付方式
  alipay_number: string;//支付宝交易号
  order_status: string;// 订单状态
  payment_status: string; // 支付状态
  shipping_address: string;// 发货地址
  billing_address: string;// 收货地址
  payTime: string | Date;// 支付时间，自动更新
  transactionTime:string | Date// 成交时间，自动更新
  comments: string;// 订单备注
  createTime: string | Date;// 更新时间，自动更新
  updateTime: string | Date;// 创建时间，自动填充
}

// 定义搜索参数
interface SearchParams {
  shop_id?: string;
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
  prop: keyof OrderInfo;
  type: string;
  width?: string;
}

const axios: AxiosInstance = inject("axios") as AxiosInstance;

const dialogVisible = ref(false);
const dialogType = ref("");




// 对话框表单
const formFields = ref<FormField<any>[]>([
  {
    type: "text",
    label: "订单号",
    prop: "order_id",
    placeholder: "当前订单",
    group: "基本信息", // 添加 group 属性
    loading: false,
    show: true,
    rules: [{ required: true, message: "请选择优惠券类型", trigger: "blur" }],

  },
  {
    type: "select",
    label: "下单店铺",
    prop: "shop_name",
    placeholder: "选择店铺",
    loading: false,
    show: true,
    group: "基本信息",
    rules: [{ required: false, message: "请选择下单店铺", trigger: "blur" }],
    options: [],
    onFocus: async function (_value: any, field: FormField<any>) {
            //获取当前店铺名字以及id号
      let currentShop = localStorage.getItem("currentShop");
      currentShop = JSON.parse(currentShop || "{}");
      // console.log(currentShop);
      if (currentShop && Array.isArray(currentShop)) {
      field.options = currentShop.map((item: any) => {
          return {
            label: item.shop_name,
            value: item.shop_id,
          };
        });
      } else {
        console.error("currentShop is not an array or is null");
      }
    }
  },
  {
    type: "text",
    label: "商品名称",
    prop: "product_name",
    placeholder: "商品名称",
    show: true,
    group: "基本信息",
    rules: [
      { required: false, message: "商品名称", trigger: "blur" },
    ],
  },
  {
    type: "number",
    label: "下单数量",
    prop: "quantity",
    placeholder: "下单数量",
    show: true,
    rules: [{ required: true, message: "下单数量", trigger: "blur" }],
    group: "使用规则", // 添加 group 属性
  },
  {
    type: "text",
    label: "订单状态",
    prop: "order_status",
    placeholder: "订单状态",
    show: true,
    rules: [{ required: true, message: "订单状态", trigger: "blur" }],
    group: "使用规则", // 添加 group 属性
    options: [
      { label: "待发货", value: "Pending" },
      { label: "已发货", value: "Shipped" },
      { label: "待收货", value: "paid" },
      { label: "已收货", value: "Delivered" },
      { label: "取消订单", value: "Cancelled" },
      // 其他订单状态...
    ],
  },
  // {
  //   type: "number",
  //   label: "使用次数限制",
  //   prop: "usage_limit",
  //   placeholder: "使用次数限制",
  //   show: true,
  //   min: 0,
  //   rules: [{ required: true, message: "请输入使用次数限制", trigger: "blur" }],
  //   group: "使用规则", // 添加 group 属性
  // },
  // {
  //   type: "number",
  //   label: "已使用次数",
  //   prop: "used_count",
  //   placeholder: "已使用次数",
  //   show: true,
  //   min: 0,
  //   rules: [{ required: true, message: "请输入已使用次数", trigger: "blur" }],
  //   group: "使用规则", // 添加 group 属性
  // },
  // {
  //   type: "select",
  //   label: "优惠券状态",
  //   prop: "coupon_status",
  //   placeholder: "请选择优惠券状态",
  //   show: true,
  //   rules: [{ required: true, message: "请选择优惠券状态", trigger: "blur" }],
  //   options: [
  //     { label: "启用", value: 1 },
  //     { label: "禁用", value: 0 },
  //     // 其他状态...
  //   ],
  //   group: "使用规则", // 添加 group 属性
  // },
  // {
  //   type: "number",
  //   label: "最低消费金额",
  //   prop: "min_purchase_amt",
  //   tips: "最低消费金额为0时, 优惠券为无门槛立减券",
  //   placeholder: "最低消费金额",
  //   show: true,
  //   min: 0,
  //   rules: [
  //     { required: false, message: "请输入最低消费金额", trigger: "blur" },
  //   ],
  //   group: "商品与用户限制", // 添加 group 属性
  // },
  // {
  //   type: "number",
  //   label: "折扣上限金额",
  //   prop: "max_discount_amt",
  //   tips: "折扣上限金额为0时,折扣无上限",
  //   placeholder: "折扣上限金额",
  //   show: true,
  //   min: 0,
  //   rules: [
  //     { required: false, message: "请输入折扣上限金额", trigger: "blur" },
  //   ],
  //   group: "商品与用户限制", // 添加 group 属性
  // },
  // {
  //   type: "select",
  //   label: "适用商品",
  //   prop: "applicable_items",
  //   multiple: true,
  //   placeholder: "请选择适用商品",
  //   show: true,
  //   group: "商品与用户限制", // 添加 group 属性
  //   rules: [{ required: false, message: "请选择适用商品", trigger: "blur" }],
  //   options: [],
  //   onFocus: async function (_value: any, field: FormField<any>) {
  //     await axios
  //       .get("/products/getProductPagination", {
  //         params: {
  //           pageNum: 1,
  //           pageSize: 10,
  //           product: "{}",
  //         },
  //       })
  //       .then((res) => {
  //         const list = res.data.data.list;
  //         field.options = list.map((item: any) => {
  //           return {
  //             label: item.product_name,
  //             value: item.product_id,
  //           };
  //         });
  //       });
  //   },
  // },
  // {
  //   type: "select",
  //   remote: true,
  //   label: "适用用户",
  //   prop: "user_id",
  //   placeholder: "请输入适用用户",
  //   show: true,
  //   rules: [{ required: false, message: "请输入适用用户", trigger: "blur" }],
  //   options: [],
  //   fetchOptions: function (query) {
  //     // 这里应该是一个异步请求来获取用户列表
  //     axios.get("/users", { params: { query } }).then((response) => {
  //       this.options = response.data; // 更新 options
  //     });
  //   },
  //   group: "商品与用户限制", // 添加 group 属性
  // },
  // {
  //   type: "textarea",
  //   label: "优惠券描述",
  //   prop: "description",
  //   placeholder: "请输入优惠券描述",
  //   show: true,
  //   group: "描述", // 添加 group 属性
  // },
]);

// 搜索类型定义
const searchList = [
  {
    label: "订单号",
    value: "order_id",
  },
  {
    label: "订单状态",
    value: "order_status",
  },
  {
    label: "支付状态",
    value: "payment_status",
  },
  {
    label: "支付方式",
    value: "payment_method",
  },
  {
    label: "下单数量",
    value: "quantity",
  },
  {
    label: "订单总额",
    value: "order_total",
  },
  {
    label: "支付时间",
    value: "payTime",
  },
  {
    label: "成交时间",
    value: "transactionTime",
  },
  
];

// 示例数据
const tableData = ref<OrderInfo[]>([]);

// 表头定义
const columns: TableColumn[] = [
  {
    label: "订单号",
    prop: "order_id",
    type: "tag",
    width: "120px",
  },
  {
    label: "下单用户",
    prop: "customer_name",
    type: "default",
    width: "120px",
  },
  {
    label: "下单店铺",
    prop: "shop_name",
    type: "tag",
    width: "120px",
  },
  {
    label: "商品名称",
    prop: "product_name",
    type: "default",
    width: "120px",
  },
  {
    label: "下单数量",
    prop: "quantity",
    type: "default",
    width: "120px",
  },
  {
    label: "订单总额",
    prop: "order_total",
    type: "default",
    width: "120px",
  },
  {
    label: "运费",
    prop: "freight",
    type: "default",
    width: "120px",
  },
  {
    label: "实际付款（元）",
    prop: "disbursements",
    type: "default",
    width: "120px",
  },
  {
    label: "支付方式",
    prop: "payment_method",
    type: "default",
    width: "120px",
  },
  {
    label: "交易号",
    prop: "alipay_number",
    type: "text",
    width: "200px",
  },
  {
    label: "订单状态",
    prop: "order_status",
    type: "tag",
    width: "120px",
  },
  {
    label: "支付状态",
    prop: "payment_status",
    type: "tag",
    width: "120px",
  },
  {
    label: "订单备注",
    prop: "comments",
    type: "text",
    width: "120px",
  },
  {
    label: "发货地址",
    prop: "shipping_address",
    type: "text",
    width: "120px",
  },
  {
    label: "收货地址",
    prop: "billing_address",
    type: "text",
    width: "120px",
  },
  {
    label: "支付时间",
    prop: "payTime",
    type: "default",
    width: "120px",
  },
  {
    label: "成交时间",
    prop: "transactionTime",
    type: "default",
    width: "120px",
  },
  {
    label: "创建时间",
    prop: "createTime",
    type: "default",
    width: "120px",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    type: "default",
    width: "120px",
  },
];

// 分页信息
const page: PageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 勾选数据
const selectList = ref<OrderInfo[]>([]);
// 点击编辑的数据
const editData = ref<OrderInfo>();

//获取当前的店铺id
const shopId = JSON.parse(localStorage.getItem("currentShop") || "{}").shop_id;

// 构造查询对象
const queryParams = ref<SearchParams>({"shop_id": shopId});
const loading = ref(false); // 加载状态

// 获取当前用户权限（什么类型的用户）
const userRole = JSON.parse(localStorage.getItem("user") || "{}").role;
console.log("userRole", userRole);



// 编辑行的方法
const editRow = (row: OrderInfo) => {
  console.log("编辑行:", row);
  dialogType.value = "edit";
  dialogVisible.value = true;
  editData.value = { ...row };
};

// 删除行的方法
const deleteRow = async (row: OrderInfo) => {
  try {
    await axios.delete(`/coupon/${row.order_id}`).then(async (res) => {
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
  const ids = selectList.value.map((item) => item.order_id);
  try {
    await axios.post("/coupon/batch", ids).then(async (res) => {
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
const updateSelection = (selectedRows: OrderInfo[]) => {
  selectList.value = selectedRows;
};

// 数据上传
const handleFormSubmit = async (data: OrderInfo) => {
  // 最低消费金额为空设为0
  if (!data.min_purchase_amt) {
    data.min_purchase_amt = 0;
  }
  // 获取type_id
  if (!data.type_id) {
    let option = formFields.value[0].options?.find((item) => {
      return item.value === data.type_name;
    });
    data.type_id = option?.id as string;
  }
  
  // 比较原始数据与新数据
  const hasChanges = compareObjects(editData.value, data);
  // 将适用商品数组转换为字符串
  data.applicable_items = JSON.stringify(data.applicable_items);

  try {
    data.start_date = convertToCustomFormat(data.start_date)
    data.end_date = convertToCustomFormat(data.end_date)
    if (dialogType.value === "add") {
      console.log("新增优惠券数据:", data);
      console.log( data.start_date);
      
      await axios.post("/coupon", data).then(async (res) => {
        if (res.data.code === 200) {
          ElMessage.success("添加成功");
          await getTableData();
          dialogVisible.value = false;
        }
      });
    } else if (dialogType.value === "edit") {
      if (hasChanges) return ElMessage.warning("数据未发生改变");
      data.start_date = convertToCustomFormat2(data.start_date);
      data.end_date = convertToCustomFormat2(data.end_date);
      delete data.type_name;
      await axios.put("/coupon", data).then(async (res) => {
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
    order: string;
    userRole: string;
    pageNum: number;
    pageSize: number;
    timeRange?: string; // 添加可选的 timeRange 属性
  } = {
    order:
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
    const response = await axios.get("/orders", { params });
    console.log("返回数据:", response);
    if (response.data.code === 200) {
      const records = response.data.data.records;
      console.log(records)
      // 使用 Promise.all 等待所有异步请求完成
      await Promise.all(
        records.map(async (item: OrderInfo) => {
          // console.log(2)
          try {
            const res = await axios.get(`/orders/order-types/${item.customer_id}/${item.shop_id}/${item.product_id}`);
            console.log("res", res);
            item.customer_name = res.data.data.customer_name;
            item.shop_name = res.data.data.shop_name;
            item.product_name = res.data.data.product_name;

          } catch (e) {
            // 处理单个请求的错误
            console.error(
              `Failed to fetch type_name for type_id ${item}:`,
              e
            );
            
          }
          // console.log(3)
          // 格式化日期
          // item.createTime = item.createTime.toString().split("T")[0];
          // item.updateTime = item.updateTime.toString().split("T")[0];
          // 将applicable_items 字符串转换为数组
          // item.applicable_items = JSON.parse(item.applicable_items);
        })
      );

      tableData.value = records;
      console.log("tableData", tableData.value);
      page.total = response.data.data.total;
      loading.value = false;
    } else {
      console.log("获取数据为空数据");
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
