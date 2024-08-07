<template>
  <div class="list w-full h-full p-3 pb-24 overflow-y-auto">
    <div class="content flex flex-col w-full h-full bg-white">
      <div class="tools p-4">
        <p class="text-left">搜索商品：</p>
        <div class="search mt-2 flex flex-nowrap justify-start items-center">
          <div class="option">
            <el-input v-model="searchText" style="max-width: 600px" placeholder="请输入内容" class="input-with-select">
              <template #prepend>
                <el-select v-model="searchType" placeholder="搜索类型" style="width: 120px">
                  <el-option v-for="item in searchList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="option flex items-center">
            <span class="label px-2">
              时间范围:
            </span>
            <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始时间"
              end-placeholder="结束时间" style="width: 300px" />
          </div>
          <div class="option">
            <el-button :icon="Search" type="primary" class="ml-2">搜索</el-button>
            <el-button type="danger" plain>Clear</el-button>
          </div>

        </div>
      </div>
      <div class="tableBox flex-1">
        <el-table class="my-[20px]" ref="multipleTableRef" :data="tableData" style="width: 100%" height="600"
          max-height="600" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />

          <el-table-column label="商品图片" width="88">
            <template #default="scope">
              <el-image :src="scope.row.main_image" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" preview-teleported
                :preview-src-list="[
                  scope.row.main_image
                ]" fit="cover" style="width: 64px; height: 64px;" />
            </template>
          </el-table-column>

          <el-table-column property="brand_id" label="品牌" width="120" />

          <el-table-column property="price" label="价格/元" width="120" />

          <el-table-column property="cost_price" label="成本价格/元" width="120" />

          <el-table-column property="stock_quantity" label="库存" width="120" />

          <el-table-column prop="updateTime" label="修改日期" sortable width="160">
            <template #default="scope">{{ scope.row.updateTime }}</template>
          </el-table-column>

          <el-table-column property="category_id" label="分类" width="120" />

          <el-table-column show-overflow-tooltip property="description" label="描述" />

          <!-- 添加操作列 -->
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button size="small" type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tableFoot flex justify-end p-4">
        <el-pagination background layout="total, prev, pager, next, jumper " @size-change="handleSizeChange"
          v-model:current-page="page.currentPage" :page-sizes="[10, 20, 30, 50]" v-model:page-size="page.pageSize"
          :total="page.total" @current-change="handleCurrentChange" class="self-end">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted, Ref } from "vue";
import { Axios, AxiosResponse } from "axios";

import { formatDate } from "@/utils/formatDate";
import User from "@/model/User";
import Product from "@/model/Product";

// 获取 axios
const axios: Axios = inject("axios") as Axios;

const searchText = ref("");
const searchType = ref("");

const time = ref("");

const searchList = [
  {
    value: "product_name",
    label: "商品名称",
  },
  {
    value: "brand",
    label: "商品品牌",
  },
];


const startTime = ref("");
const endTime = ref("");

const Search = ref("");

// 示例数据
let tableData: Ref<Product[]> = ref([] as Product[]);

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

// 定义请求体
const product = {};

const page = reactive({
  pageNum: 1,
  pageSize: 10,
  currentPage: 1,
  total: 0,
});
const handlGetproductList = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "");
  // console.log(user);

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
          // console.log(item);
          item.tags = JSON.parse(item.tags || "");
          item.updateTime = item.updateTime.join("-");
        });
      });
  }
  if (user.role == "ShopOwner") {
  }
};

// 模拟的事件处理函数
const editRow = (index: any, row: any) => {
  console.log("编辑行:", index, row);
};

const deleteRow = (index: any, row: any) => {
  console.log("删除行:", index, row);
  // 在实际应用中，你可能需要从 data 数组中移除该行
  tableData.value.splice(index, 1);
};

// 当组件挂载时执行数据请求
onMounted(() => {
  handlGetproductList();
});

// 格式化日期的函数
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

<style scoped>

</style>
