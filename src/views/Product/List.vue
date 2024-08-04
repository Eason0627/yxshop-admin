<template>
  <div class="container mx-auto m-4 p-4 bg-white shadow-lg flex flex-col ">
    <p class="text-left	 ">搜索商品：</p>

    <div class="search mt-2 flex flex-nowrap justify-start items-center">
      <el-input
        v-model="input"
        style="width: 240px"
        placeholder="请输入..."
        clearable
      />

      <el-select
          class="ml-[10px]"
        v-model="value"
        clearable
        placeholder="Select"
        style="width: 100px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-input
            class="border-r-0"
            v-model="input2"
            style="width: 200px"
            placeholder="请输入..."
            clearable
          />

      <Search class="w-[30px] h-[30px] px-1 border mr-3" />

      <div class="demo-time-range">
        <el-time-select
          v-model="startTime"
          style="width: 120px"
          :max-time="endTime"
          class="mr-4"
          placeholder="Start time"
          start="08:30"
          step="00:15"
          end="18:30"
        />
        <el-time-select
          v-model="endTime"
          style="width: 120px"
          :min-time="startTime"
          placeholder="End time"
          start="08:30"
          step="00:15"
          end="18:30"
        />
      </div>
       <el-button :icon="Search" type="primary" class="ml-2">搜索</el-button>

      <el-button type="danger" plain >Clear</el-button>
    </div>

    <el-table
      class="my-[20px]"
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="商品图片" width="120">
        <template #default="scope">
          <img :src="scope.row.main_image" alt="商品图片" style="max-width: 100%; height: auto;">
          </template>
      </el-table-column>

      <el-table-column property="product_name" label="商品名称" width="120" />

      <el-table-column property="brand_id" label="品牌" width="120" />

      <el-table-column property="price" label="价格/元" width="120" />
      <el-table-column property="cost_price" label="成本价格/元" width="120" />

      <el-table-column property="stock_quantity" label="库存" width="120" />


      <el-table-column label="修改日期" width="120">
        <template #default="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>

      <el-table-column property="category_id" label="分类" />

      <el-table-column property="description" label="描述" />

          <!-- 添加操作列 -->
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <el-pagination background layout="prev, pager, next" :total="1000" class="self-end" />
    

  </div>
</template>

<script setup lang="ts">
import { ref, reactive ,inject,onMounted} from 'vue';
import { Axios, AxiosResponse } from "axios";
import User from '@/model/User';
import Product from '@/model/Product';
import { ElTable } from 'element-plus';

// 获取 axios
const axios: Axios = inject("axios") as Axios;

const input = ref('')

const value = ref('')

const options = [
  {
    value: 'product_id',
    label: '商品id',
  },
  {
    value: 'product_name',
    label: '商品名称',
  },
  {
    value: 'price',
    label: '商品价格',
  }
  
]

const input2 = ref('')


const startTime = ref('')
const endTime = ref('')

const Search  = ref('')

// 示例数据
let tableData: Ref<Product[]> = ref([] as Product[]);

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])


const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

// 定义请求体
const product = {}

const handlGetproductList = async () => {
  const user = JSON.parse(localStorage.getItem("user") || '')
  // console.log(user);
  
  if (user.role == "Customer") {
    await axios.get("/products", product).then((res: AxiosResponse) => {
      tableData.value = res.data.data;
      tableData.value.forEach((item: Product) => {
        item.additional_images = JSON.parse(item.additional_images || '')
        item.details_images = JSON.parse(item.details_images || '')
        item.tags = JSON.parse(item.tags || '')
      })
      console.log(tableData);
    })
  }
  if (user.role == "ShopOwner") {
    
  }

}

// 模拟的事件处理函数
const editRow = (index: any, row: any) => {
  console.log('编辑行:', index, row);
};

const deleteRow = (index: any, row: any) => {
  console.log('删除行:', index, row);
  // 在实际应用中，你可能需要从 data 数组中移除该行
  tableData.value.splice(index, 1);
};


// 当组件挂载时执行数据请求
onMounted(() => {
  handlGetproductList();
});

</script>

<style scoped>
/* 添加一些样式 */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 10px;
  border: 1px solid #a6a8ad;
  transition: all 0.3s

}

li:hover{
  background: #1f9fff;
  color: aliceblue
}

/* 为了确保 Tailwind CSS 类正确应用 */
table {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}
</style>