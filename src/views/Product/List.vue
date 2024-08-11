<template>
  <div class="list w-full h-full p-3 pb-24">
    <div
      class="content flex flex-col w-full h-full border-[1px] border-[--info-border-color] rounded-md overflow-y-auto bg-white"
    >
      <div class="tools p-4 mb-4">
        <p class="text-left">搜索商品：</p>
        <div class="search mt-2 flex flex-nowrap justify-start items-center">
          <div class="option">
            <el-input
              v-model="searchText"
              style="max-width: 300px"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <template #prepend>
                <el-select
                  v-model="searchType"
                  placeholder="搜索类型"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in searchList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="option flex items-center">
            <span class="label px-2"> 时间范围: </span>
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="创建时间"
              end-placeholder="更新时间"
              style="width: 300px"
            />
          </div>
          <div class="option">
            <el-button type="primary" class="ml-2"
              >搜索</el-button
            >
            <el-button type="danger" plain @click="resetSearch">清除</el-button>
          </div>
        </div>
      </div>
      <div class="tableBox flex-1">
        <el-table
          class="border-t-[1px] border-[--info-border-color]"
          ref="multipleTableRef"
          :data="tableData"
          style="width: 100%"
          height="600"
          max-height="600"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column label="商品图片" width="88">
            <template #default="scope">
              <el-image
                :src="scope.row.main_image"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                preview-teleported
                :preview-src-list="[scope.row.main_image]"
                fit="cover"
                style="width: 64px; height: 64px"
              />
            </template>
          </el-table-column>

          <el-table-column
            property="product_name"
            label="商品名称"
            width="120"
          />

          <el-table-column property="brand_id" label="品牌" width="120" />

          <el-table-column property="price" label="价格/元" width="120" />

          <el-table-column
            property="cost_price"
            label="成本价格/元"
            width="120"
          />

          <el-table-column property="stock_quantity" label="库存" width="120" />

          <el-table-column
            prop="updateTime"
            label="修改日期"
            sortable
            width="160"
          >
            <template #default="scope">{{ scope.row.updateTime }}</template>
          </el-table-column>

          <el-table-column
            property="category_id"
            label="分类"
            width="120"
            sortable
          />
          <el-table-column
            property="product_status"
            label="上/下架"
            width="120"
            sortable
          />

          <el-table-column
            show-overflow-tooltip
            property="description"
            label="描述"
          />

          <!-- 添加操作列 -->
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                @click="editRow(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="deleteRow(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        class="tableFoot flex justify-end p-4 border-t-[1px] border-[--info-border-color] overflow-y-auto"
      >
        <el-pagination
          background
          layout="total, prev, pager, next, jumper "
          @size-change="handleSizeChange"
          v-model:current-page="page.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          v-model:page-size="page.pageSize"
          :total="page.total"
          @current-change="handleCurrentChange"
          class="self-end"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 删除弹窗 -->
    <el-dialog v-model="deletedialogVisible" title="删除数据" width="500">
      <span>确定删除这一条数据吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deletedialogVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteRow()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改弹窗 -->
    <UpdateDialog
      v-model:dialogFormVisible="dialogVisible"
      v-model:form="form"
      v-model:categoryList="categoryList"
    ></UpdateDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted, Ref } from "vue";
import { Axios, AxiosResponse } from "axios";

import UpdateDialog from "./UpdateDialog.vue";
import { ElMessage, ElTable } from "element-plus";
// import { formatDate } from "@/utils/formatDate";
import User from "@/model/User";
import Product from "@/model/Product";

// 获取 axios
const axios: Axios = inject("axios") as Axios;

// 修改弹出窗口控制
const dialogVisible = ref(false);

//删除弹窗控制
const deletedialogVisible = ref(false);
const indexdata: any = ref("");
const rowdata: any = ref("");
const changedaialog = (index: any, row: any) => {
  deletedialogVisible.value = true;
  indexdata.value = index;
  rowdata.value = row;
};

//定义修改表单对象
let form = reactive({
  product_info: {
    product_id:"",
    product_name: "",
    description: "这款星辰X5 Pro 智能手机是一款旗舰级设备，旨在",
    brand_id: 2,
    shop_id: 1813922145265389568,
    origin: "中国",
    material: "556",
    size: "6.7",
    color: "黑色",
    weight: 255,
    packaging_details: "三无产品",
    warranty_info: "5年质保",
    production_date: "2024-08-14",
    expiration_date: "2024-08-16",
    category_id: 0,
    main_image: "",
    additional_images: [],
    details_images: [],
    tags: ["手机", "数码"],
  },
  product_sales: {
    price: 699,//售价
    cost_price: 52,//成本价
    stock_quantity: 4500,//库存
    reorder_threshold: 0,//在订购点
    promotion_details: "满500减100元",
    shipping_fee: 10,
    sales_status:""
  },
  inventory: {
    warehouse_id: 1816111338636840960,
    stock_quantity: 45000,
    safety_stock: 5000,
    last_restock_date: "",//上次捕获日期
    restock_threshold: 400,//捕获缺乏值
  },
});
//修改弹窗以及获取商品信息
function editRow(index: any, row: any) {
  dialogVisible.value = !dialogVisible.value;
  indexdata.value = index;
  rowdata.value = row;
  axios
    .get(`/products/${rowdata.value.product_id}`)
    .then((response: AxiosResponse) => {
      console.log(typeof response.data.data.product_id)
      const Data = response.data.data;
      // console.log(Data)
      form.product_info.product_id = Data.product_id
      form.product_info.product_name = Data.product_name;
      form.product_info.description = Data.description;
      form.product_info.brand_id = Data.brand_id;
      form.product_info.shop_id = Data.shop_id;
      form.product_info.origin = Data.origin;
      form.product_info.material = Data.material;
      form.product_info.size = Data.size;
      form.product_info.color = Data.color;
      form.product_info.weight = Data.weight;
      form.product_info.packaging_details = Data.packaging_details;
      form.product_info.warranty_info = Data.warranty_info;
      form.product_info.production_date = Data.production_date;
      form.product_info.expiration_date = Data.expiration_date;
      form.product_info.category_id = Data.category_id;
      form.product_info.main_image = Data.main_image;
      form.product_info.additional_images = JSON.parse(Data.additional_images || "");
      form.product_info.details_images = JSON.parse(Data.details_images || "");
      form.product_info.tags = Data.tags;

      form.product_sales.price = Data.price;
      form.product_sales.cost_price = Data.cost_price;
      form.product_sales.stock_quantity = Data.stock_quantity;
      form.product_sales.reorder_threshold = Data.reorder_threshold;
      form.product_sales.promotion_details = Data.promotion_details;
      form.product_sales.shipping_fee = Data.shipping_fee;
      form.product_sales.sales_status = Data.sales_status;

      form.inventory.warehouse_id = Data.warehouse_id;
      // form.inventory.stock_quantity = Data.stock_quantity;
      form.inventory.safety_stock = Data.safety_stock;
      form.inventory.last_restock_date = Data.last_restock_date;
      form.inventory.restock_threshold = Data.restock_threshold;
      
      // console.log(form)

    });
}
const searchText = ref("");
const searchType = ref("");

const time = ref("");

const searchList = [
  {
    value: "product_name",
    label: "商品名称",
  },
  {
    value: "product_id",
    label: "商品id",
  },
  {
    value: "brand_id",
    label: "商品品牌",
  },
  {
    value: "shop_id",
    label: "店铺id",
  },
  {
    value: "category_name",
    label: "分类",
  },
  {
    value: "sales_status",
    label: "销售状态",
  },
];

// const startTime = ref("");
// const endTime = ref("");

// const Search = ref("");

//定义分类类型
interface Category {
  category_id: number;
  category_name: string;
}

// 示例数据
let tableData: Ref<Product[]> = ref([] as Product[]);
const categoryList = ref<Category[]>([]);
// 映射对象
const categoryMapping: Record<string, string> = {};
categoryList.value.forEach((category) => {
  categoryMapping[category.category_id] = category.category_name;
});

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

// 定义请求体
interface ProductType {
  [key: string]: string; // 允许任何字符串作为键，并且值也是字符串
}
// const product = ref<ProductType>({})
let product: ProductType = {}; // 明确声明 product 为 ProductType 类型

const page = reactive({
  pageNum: 1,
  pageSize: 10,
  currentPage: 1,
  total: 0,
});
//清空搜索条件
function resetSearch() {
  searchText.value = "";
  searchType.value = "";
  startTime.value = "";
  endTime.value = "";
}
//获取表格数据
const handlGetproductList = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "");
  // console.log(user);
  // console.log(searchType.value,searchText.value)

  Object.keys(product).forEach((key) => delete product[key]); //清空对象
  product[searchType.value] = searchText.value; //赋值对象
  // console.log(product);

  if (user.role == "Admin") {
    await axios
      .post("/products/getall", product, {
        params: {
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        },
      })
      .then((res: AxiosResponse) => {
        page.total = res.data.data.total;
        tableData.value = res.data.data.list;
        tableData.value.forEach((item: Product) => {
          item.tags = JSON.parse(item.tags || "");
          item.updateTime = item.updateTime.join("-");
        });
        // console.log(tableData.value);
      });
  }
  if (user.role == "ShopOwner") {
  }
};


//删除单个商品数据
const deleteRow = (index: any, row: any) => {
  console.log("删除行:", index, row);
  // 在实际应用中，你可能需要从 data 数组中移除该行
  tableData.value.splice(indexdata, 1);
  // console.log(row.product_id);
  axios
    .delete(`/products/${row.product_id}`)
    .then((res: AxiosResponse) => {
      console.log(res.data);
      ElMessage({
        message: res.data.data,
        type: "success",
      });
      deletedialogVisible.value = false;
    })
    .catch(() => {
      ElMessage({
        message: "删除失败",
        type: "error",
      });
      deletedialogVisible.value = false;
    });
};
//批量删除商品数据
// const deleteRows = () => {
//   // 在实际应用中，你可能需要从 data 数组中移除这些行
//   multipleSelection.value.forEach((item: Product) => {
//     const index = tableData.value.indexOf(item);
//     if (index > -1) {
//       tableData.value.splice(index, 1);
//     }
//   });
// };

//请求分类id列表
const handleCategory = () => {
  axios
    .get(`/category`)
    .then((response: AxiosResponse) => {
      const Data: Category[] = response.data.data;
      // console.log(Data);
      categoryList.value = Data;
      // console.log(categoryList.value)
    })
    .catch((error: any) => {
      console.error(error);
    });
};

// 计算属性来转换上下架名称
// const transformedTableData = computed(() => {
//   return tableData.value.map(item => {
//     const categoryName = categoryMapping[item.category_id] || '未知分类';
//     return {
//       ...item,
//       category_id: categoryName
//     };
//   });
// });
// console.log(transformedTableData);

// 当组件挂载时执行数据请求
onMounted(() => {
  handleCategory();
  handlGetproductList();
});

// 格式化日期的函数git p
// function formatToCustomString(date: Date): string {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从 0 开始的，所以加 1
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");

//   return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
// }

// 分页
function handleCurrentChange(val: number) {
  page.pageNum = val;
  handlGetproductList();
}

function handleSizeChange(val: number) {
  page.currentPage = val;
}
</script>

<style lang="scss" scoped></style>
