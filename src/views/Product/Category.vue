<template>
  <div class="list w-full h-full p-4 pb-24">
    <div
      class="content flex flex-col w-full h-full border-[1px] border-[--info-border-color] rounded-md overflow-y-auto bg-white">
      <div class="title p-4 text-2xl font-bold">商品分类</div>
      <div class="tools flex justify-between items-center p-4 mb-[-1px] border-[1px] border-[--info-border-color]">
        <div class="search mt-2 flex flex-nowrap justify-start items-center">
          <p class="text-left">筛选条件：</p>
          <div class="option">
            <el-input v-model="searchText" style="max-width: 300px" placeholder="请输入内容" class="input-with-select">
              <template #prepend>
                <el-select v-model="searchType" placeholder="搜索类型" style="width: 120px">
                  <el-option v-for="item in searchList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="option flex items-center">
            <span class="label px-2"> 时间范围: </span>
            <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始时间"
              end-placeholder="结束时间" @change="handleTimeChange" style="width: 300px" />
          </div>
          <div class="option">
            <el-button type="primary" class="ml-2" @click="searchData">搜索</el-button>
            <el-button type="danger" plain>清除</el-button>
          </div>
        </div>
        <div class="action flex items-center">
          <div class="tip mr-2 self-end text-sm text-[--error-color] underline cursor-pointer">
            已选<span>{{ selectData.length }}</span>条数据
          </div>
          <div class="del">
            <el-button type="danger" plain class="mr-2" @click="delData">删除所选</el-button>
          </div>
          <div class="add">
            <el-button type="primary" @click="(dialogVisible = true) && (dialogType = 'add')">新增分类</el-button>
          </div>
        </div>
      </div>
      <div class="tableBox flex-1">
        <el-table class="mt-[-1]" ref="multipleTableRef" :data="productCategory" max-height="600" border
          @select="handleSelect" @select-all="handleSelectAll">
          <el-table-column :type="item.type" :prop="item.prop" :label="item.label" :width="item.width" align="center"
            v-for="item in tableHeader">
            <template v-if="item.type === 'image'" #default="scope">
              <el-image :src="scope.row.image_url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" preview-teleported
                :preview-src-list="[scope.row.image_url]" fit="cover" style="width: 64px; height: 64px" />
            </template>
            <template v-if="item.type === 'operation'" #default="scope">
              <el-button type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tableFoot flex justify-end p-4 border-t-[1px] border-[--info-border-color] overflow-y-auto">
        <el-pagination background layout="total, prev, pager, next, jumper " @size-change="handleSizeChange"
          v-model:current-page="page.currentPage" :page-sizes="[10, 20, 30, 50]" v-model:page-size="page.pageSize"
          :total="page.total" @current-change="handleCurrentChange" class="self-end">
        </el-pagination>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" width="500" destroy-on-close>
      <template #header>
        <div class="mb-4 text-xl font-bold">新增分类</div>
      </template>
      <div class="content flex justify-center items-center p-4">
        <el-form class="w-full" :model="category">
          <el-form-item class="flex items-center" label="分类图片">
            <div class="image flex justify-center items-center w-36 h-36 rounded-md overflow-hidden"
              v-if="category.image_url">
              <el-image :src="category.image_url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" preview-teleported
                :preview-src-list="[category.image_url]" fit="cover" style="width: 100%; height: 100%" />
            </div>
            <div class="upload" v-else>
              <FileUploader ref="uploadRef" action="http://localhost:8080/upload" :multiple="true" :limit="1"
                :before-upload="validateImage" @change="uploadChange" @onSuccess="success" @onError="error" />
            </div>
          </el-form-item>
          <el-form-item class="flex items-center" label="分类名称">
            <el-input v-model="category.category_name" placeholder="输入分类名称..." />
          </el-form-item>
          <el-form-item class="flex items-center" label="分类描述">
            <el-input v-model="category.description" placeholder="输入分类描述..." />
          </el-form-item>
          <el-form-item class="flex items-center" label="上级分类">
            <el-select v-model="category.parentCategory_id" placeholder="选择上级分类...">
              <el-option :label="item.category_name" :value="item.category_id" v-for="item in productCategory" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogCancel">取消</el-button>
          <el-button type="primary" @click="dialogConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted, markRaw } from "vue";
import type { UploadInstance } from 'element-plus'
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { Axios, AxiosResponse } from "axios";

import FileUploader from "@/components/upload/FileUploader.vue";
import ProductCategory from "@/model/ProductCategory";
import { formatDate } from "@/utils/formatDate";

// 获取 axios
const axios: Axios = inject("axios") as Axios;

const searchText = ref("");
const searchType = ref("");

const time = ref("");

const searchList = [
  {
    value: "product_name",
    label: "分类名称",
  },
];

const startTime = ref("");
const endTime = ref("");

// 新增对话框控制变量
const dialogVisible = ref(false);
const dialogType = ref("");
// 新增分类
let category = ref<ProductCategory>({
  category_id: "",
  shop_id: "",
  image_url: "",
  category_name: "",
  description: "",
  parentCategory_id: "",
});



// 渲染表头
const tableHeader = [
  {
    type: "selection",
    width: "55",
  },
  {
    label: "分类图片",
    prop: "image_url",
    type: "image",
  },
  {
    label: "分类名称",
    prop: "category_name",
    type: "default",
  },
  {
    label: "分类描述",
    prop: "description",
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
    label: "操作",
    prop: "operation",
    width: "200",
    type: "operation",
  },
];

// 渲染数据
let productCategory = ref<ProductCategory[]>([
  {
    image_url: "https://picsum.photos/200/300",
    category_id: "1",
    category_name: "手机",
    description: "手机",
    createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
    updateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  },
  {
    image_url: "https://picsum.photos/200/300",
    category_id: "2",
    category_name: "电脑",
    description: "电脑",
    createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
    updateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  },
  {
    image_url: "https://picsum.photos/200/300",
    category_id: "3",
    category_name: "相机",
    description: "相机",
    createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
    updateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  },
  {
    image_url: "https://picsum.photos/200/300",
    category_id: "1",
    category_name: "手机",
    description: "手机",
    createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
    updateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  },
  {
    image_url: "https://picsum.photos/200/300",
    category_id: "2",
    category_name: "电脑",
    description: "电脑",
    createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
    updateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  },
  {
    image_url: "https://picsum.photos/200/300",
    category_id: "3",
    category_name: "相机",
    description: "相机",
    createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
    updateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  },
]);

// 所选数据
const selectData = ref<any>([]);
const editIndex = ref(0);
// 分页对象
const page = reactive({
  pageNum: 1,
  pageSize: 10,
  currentPage: 1,
  total: 0,
});

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

// 时间范围改变
const handleTimeChange = (value: Array<Date>) => {
  if (!value) return;
  startTime.value = formatDate(value[0], "yyyy-MM-dd hh:mm:ss");
  endTime.value = formatDate(value[1], "yyyy-MM-dd hh:mm:ss");
};

// 模拟的事件处理函数
const editRow = (index: number, row: ProductCategory) => {
  console.log("编辑行:", index, JSON.parse(JSON.stringify(row)));
  editIndex.value = index;
  dialogVisible.value = true;
  dialogType.value = "edit";
  category.value = { ...row };
};

//条件搜索
const searchData = async ()=>{
  page.pageNum = 1;
  category.value.category_name = searchText.value;
  await handleProductCategory()
}

//根据id删除分类
const deleteRow = (index: number, row: ProductCategory) => {
  console.log("删除行:", index, row);
  ElMessageBox.confirm("确认删除所选数据？(无法恢复！)", "删除警告", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(() => {
      productCategory.value.splice(index, 1);
      axios.delete(`/category/${row.category_id}`).then((res)=>{
        console.log(res);
        ElMessage.success("删除成功！");
      })
      .catch(()=>{
        ElMessage.error("删除失败！");
      })
    })
    .catch(() => {
      // catch error
    });
};

// 清空新增分类表单
const clearCategory = () => {
  category.value = {
    category_id: "",
    shop_id: "",
    image_url: "",
    category_name: "",
    description: "",
    parentCategory_id: "",
  };
};

// 对话框取消按钮
function dialogCancel() {
  dialogVisible.value = false;
  clearCategory();
}

const uploadRef = ref<UploadInstance>();
// 对话框确认按钮
async function dialogConfirm() {
  // 数据校验
  if (!category.value.category_name || !category.value.description) {
    return ElMessage.error("数据缺失！");
  }
  if (dialogType.value == "add") {
    // 新增分类
    const currentShop = JSON.parse(localStorage.getItem("currentShop") || "")
    category.value.shop_id = currentShop.id
    //上传图片
    if(fileToUpload){
      await uploadImage()
    }
    await saveCategory()
    // 提交表单

  } else if (dialogType.value == "edit") {
    // category.value.createTime = new Date();
    // category.value.updateTime = new Date();
    if(fileToUpload){
      await uploadImage()
    }
    await updateCategory()
    productCategory.value.splice(editIndex.value, 1, category.value);
  }
  clearCategory();
  dialogVisible.value = false;
}

//添加分类函数
const saveCategory = async () => {
  // if (!category.value.image_url) {
  //   return ElMessage.error("请上传图片")
  // }
  console.log(JSON.stringify(category.value))
  await axios.post("/category", JSON.stringify(category.value))
    .then((res: AxiosResponse) => {
      console.log(res)
      ElMessage.success("添加分类成功")

    })
    .catch((err) => {
      console.log(err)
      ElMessage.error("添加分类失败")
    })
}
// 全局变量来存储待上传的文件
let fileToUpload: File | null = null;
// 图片上传函数
const uploadImage = async ()=>{
  //判断是否有图片
  const formData = new FormData();
  formData.append("file", fileToUpload);
  console.log(formData)
  await axios
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res: AxiosResponse) => {
      category.value!.image_url = res.data.data;
      fileToUpload=null
    });
}

//修改分类数据
const updateCategory = async()=> {
  delete category.value.createTime;
  delete category.value.updateTime;
  console.log(JSON.stringify(category.value))
  const requestJSON=JSON.stringify(category.value)
  //清空创建时间，修改时间
  const id = category.value.category_id
  console.log(id);
  
  await axios.put(`/category/${id}`, requestJSON)
    .then((res: AxiosResponse) => {
      console.log(res)
      ElMessage.success("修改分类成功")
      clearCategory()
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error("修改分类失败")
    })
}

//查询渲染数据
const handleProductCategory = async () => {
  const currentShop = JSON.parse(localStorage.getItem("currentShop") || "")
  category.value.shop_id = currentShop.id
  await axios.get("/category/getCategoryPagination", {
    params: {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      category: JSON.stringify(category.value)
    },
  }).then((res: AxiosResponse) => {
    // console.log(res.data.data)
    productCategory.value = res.data.data.list
    page.total = parseInt(res.data.data.total);
  })
}


// 上传前验证图片格式
function validateImage(file: File): boolean {
  // 验证图片是否为 JPEG 或 PNG
  const isJPGOrPNG = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJPGOrPNG) {
    alert("请上传 JPEG 或 PNG 格式的图片！");
    return false;
  }
  // 验证图片大小是否小于 2MB
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert("图片大小不能超过 2MB!");
    return false;
  }
  return true;
}

// 分类图片
function success(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 处理上传成功后的逻辑
  // 假设后端返回的 URL 存储在 response.data.url
  category.value.image_url = response.data;
}
function error(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function uploadChange(file: any, fileList: any[]) {
  console.log("上传图片", file);
  console.log("上传图片列表", fileList);
  fileToUpload = file.raw; // 假设 raw 属性包含实际的 File 对象
  // console.log(fileToUpload)
}

// 选择数据行
const handleSelect = (selection: any[]) => {
  selectData.value = selection;
};

// 全选数据
const handleSelectAll = (selection: any[]) => {
  selectData.value = selection;
};

// 删除所选数据
const delData = () => {
  if (selectData.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  ElMessageBox.confirm("确认删除所选数据？(无法恢复！)", "删除警告", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(() => {
      const selectId = selectData.value.map((item: ProductCategory) => {
        return item.category_id;
      });
      
      console.log(selectId)
      axios.post(`/category/delCategoryByIds`, selectId).then((res)=>{
        console.log(res);
        ElMessage.success("批量删除成功！");
        productCategory.value = productCategory.value.filter(
        (item: ProductCategory) => {
          !selectId.includes(item.category_id);
        }
      );
      })
      .catch((err)=>{
        console.log(err);
        ElMessage.error("批量删除失败！");
      })
      selectData.value = [];
    })
    .catch(() => {
      // catch error
    });
};

// 分页
function handleCurrentChange(val: number) {
  page.pageNum = val;
  // console.log(val);
  handleProductCategory()
}

function handleSizeChange(val: number) {
  page.currentPage = val;
  
}

// 当组件挂载时执行数据请求
onMounted(() => {
  handleProductCategory()
});
</script>

<style lang="scss" scoped></style>
