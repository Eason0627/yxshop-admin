<template>
  <div class="container h-screen mx-auto bg-white m-[20px] p-3 shadow-lg aaa">
    <el-form class="grid grid-flow-row-dense grid-cols-2 overflow-y-auto" ref="formRef" :model="form" :rules="rules"
      label-position="top" label-width="120px" enctype="multipart/form-data">
      <!-- 商品信息 -->
      <h3 class="text-xl col-span-2 mb-3">商品信息</h3>
      <el-form-item label="商品名称" prop="product_info.product_name" class="col-span-1 ">
        <el-input v-model="form.product_info.product_name" placeholder="请输入商品名称" />
      </el-form-item>

      <el-form-item label="商品描述" prop="product_info.description" class="col-span-1 ">
        <el-input v-model="form.product_info.description" type="textarea" placeholder="请输入商品描述" />
      </el-form-item>

      <el-form-item label="品牌ID" prop="product_info.brand_id" class="col-span-1 ">
        <el-input v-model.number="form.product_info.brand_id" placeholder="请输入品牌ID" />
      </el-form-item>

      <el-form-item label="店铺ID" prop="product_info.shop_id" class="col-span-1 ">
        <el-input v-model.number="form.product_info.shop_id" placeholder="请输入店铺ID" />
      </el-form-item>

      <el-form-item label="原产地" prop="product_info.origin" class="col-span-1 ">
        <el-input v-model="form.product_info.origin" placeholder="请输入原产地" />
      </el-form-item>

      <el-form-item label="材质" prop="product_info.material" class="col-span-1 ">
        <el-input v-model="form.product_info.material" placeholder="请输入材质" />
      </el-form-item>

      <el-form-item label="尺寸" prop="product_info.size" class="col-span-1 ">
        <el-input v-model="form.product_info.size" placeholder="请输入尺寸" />
      </el-form-item>

      <el-form-item label="颜色" prop="product_info.color" class="col-span-1 ">
        <el-input v-model="form.product_info.color" placeholder="请输入颜色" />
      </el-form-item>

      <el-form-item label="重量" prop="product_info.weight" class="col-span-1 ">
        <el-input v-model.number="form.product_info.weight" placeholder="请输入重量" />
      </el-form-item>

      <el-form-item label="包装详情" prop="product_info.packaging_details" class="col-span-1 ">
        <el-input v-model="form.product_info.packaging_details" placeholder="请输入包装详情" />
      </el-form-item>

      <el-form-item label="保修信息" prop="product_info.warranty_info" class="col-span-1 ">
        <el-input v-model="form.product_info.warranty_info" placeholder="请输入保修信息" />
      </el-form-item>

      <el-form-item label="生产日期" prop="product_info.production_date" class="col-span-1 ">
        <el-date-picker v-model="form.product_info.production_date" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="保质期" prop="product_info.expiration_date" class="col-span-1 ">
        <el-date-picker v-model="form.product_info.expiration_date" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="商品分类ID" prop="product_info.category_id" class="col-span-1 ">
        <el-input v-model.number="form.product_info.category_id" placeholder="请输入商品分类ID" />
      </el-form-item>

      <el-form-item label="商品首图（只能上传一张）" prop="product_info.main_image" class="col-span-1 " enctype="multipart/form-data">
        <FileUploader :action="uploadUrl" :multiple="true" :limit="1" :before-upload="validateImage" ref="uploadRef1"
          @onSuccess="handleUploadSuccess" @onError="handleUploadError" @change="handleUploadchange" @update:modelValue="handledelete" />
      </el-form-item>

      <el-form-item label="商品轮播图（五张）" prop="product_info.additional_images" class="col-span-1 "
        enctype="multipart/form-data">
        <FileUploader :action="uploadUrl" :multiple="true" :limit="5" :before-upload="validateImage" ref="uploadRef2"
          @onSuccess="CarouselhandleUploadSuccess" @onError="CarouselhandleUploadError" @change="CarouselhandleUploadchange" 
          @update:modelValue="Carouselhandledelete" />
      </el-form-item>

      <el-form-item label="商品详情图片（五张）" prop="product_info.details_images" class="col-span-1 " enctype="multipart/form-data">
        <FileUploader :action="uploadUrl" :multiple="true" :limit="5" :before-upload="validateImage" @change="DetailsImagesHandleUploadchange"
        ref="uploadRef3"
          @onSuccess="DetailsImagesHandleUploadSuccess" @onError="DetailsImagesHandleUploadError" @update:modelValue="DetailsImageshandledelete" />
      </el-form-item>

      <el-form-item label="标签(使用逗号分隔,)" prop="product_info.tags">
        <el-input v-model="form.product_info.tags" placeholder="请输入标签" />
      </el-form-item>

      <!-- 销售信息 -->
      <h3 class="text-xl col-span-2 mb-3">销售信息</h3>
      <el-form-item label="商品价格" prop="product_sales.price">
        <el-input v-model.number="form.product_sales.price" placeholder="请输入商品价格" />
      </el-form-item>

      <el-form-item label="成本价格" prop="product_sales.cost_price">
        <el-input v-model.number="form.product_sales.cost_price" placeholder="请输入成本价格" />
      </el-form-item>

      <el-form-item label="库存数量" prop="product_sales.stock_quantity">
        <el-input-number v-model="form.product_sales.stock_quantity" controls-position="right" :min="0"
          placeholder="请输入库存数量" />
      </el-form-item>

      <el-form-item label="促销详情" prop="product_sales.promotion_details">
        <el-input v-model="form.product_sales.promotion_details" placeholder="请输入促销详情" />
      </el-form-item>

      <el-form-item label="运费" prop="product_sales.shipping_fee">
        <el-input v-model.number="form.product_sales.shipping_fee" placeholder="请输入运费" />
      </el-form-item>


      <!-- 库存信息 -->
      <h3 class="text-xl col-span-2 mb-3">库存信息</h3>
      <el-form-item label="仓库ID" prop="inventory.warehouse_id">
        <el-input v-model.number="form.inventory.warehouse_id" placeholder="请输入仓库ID" />
      </el-form-item>

      <el-form-item label="安全库存量" prop="inventory.safety_stock">
        <el-input v-model.number="form.inventory.safety_stock" placeholder="请输入安全库存量" />
      </el-form-item>

      <el-form-item label="补货阈值" prop="inventory.restock_threshold">
        <el-input v-model.number="form.inventory.restock_threshold" placeholder="请输入补货阈值" />
      </el-form-item>

      <el-form-item class="col-span-2 mb-[50px] mt-[30px] justify-self-center">
        <el-button type="primary" @click="submitForm">发布商品</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>

      <div class="h-[200px] col-span-2"></div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted } from "vue";
import { Axios, AxiosResponse } from "axios";
import { ElMessage, UploadProps, type UploadInstance } from "element-plus";

import FileUploader from "@/components/upload/FileUploader.vue";

// 获取 axios
const axios: Axios = inject("axios") as Axios;

const uploadUrl = "http://localhost:8080/upload";
// 数据模型
interface ProductInfo {
  product_name: string;
  description: string;
  brand_id: number;
  shop_id: number;
  origin: string;
  material: string;
  size: string;
  color: string;
  weight: number;
  packaging_details: string;
  warranty_info: string;
  production_date: string;
  expiration_date: string;
  category_id: number;
  main_image: string;
  additional_images: UploadProps[];
  details_images: UploadProps[];
  tags: string[];
}

interface ProductSales {
  price: number;
  cost_price: number;
  stock_quantity: number;
  reorder_threshold: number;
  sold_quantity: number;
  review_count: number;
  average_rating: number;
  promotion_details: string;
  shipping_fee: number;
}

interface Inventory {
  warehouse_id: number;
  stock_quantity: number;
  safety_stock: number;
  last_restock_date: string;
  restock_threshold: number;
}

interface FormModel {
  [x: string]: any;
  product_info: ProductInfo;
  product_sales: ProductSales;
  inventory: Inventory;
}

const form: FormModel = reactive({
  product_info: {
    product_name: "huawei mate60 pro",
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
    price: 699,
    cost_price: 52,
    stock_quantity: 4500,
    reorder_threshold: 0,
    sold_quantity: 0,
    review_count: 0,
    average_rating: 0,
    promotion_details: "满500减100元",
    shipping_fee: 10,
  },
  inventory: {
    warehouse_id: 1816111338636840960,
    stock_quantity: 45000,
    safety_stock: 5000,
    last_restock_date: "",
    restock_threshold: 400,
  },
});
// 表单引用
const formRef = ref<HTMLInputElement | null>(null);

// 表单验证规则
const rules = reactive({
  "product_info.product_name": [
    { required: true, message: "请输入商品名称", trigger: "blur" },
  ],
  // 添加更多验证规则...
});
//图片上传引用
const uploadRef1 = ref(null);
const uploadRef2 = ref(null);
const uploadRef3 = ref(null);

//图片列表
const fileLists1 = ref<UploadProps[]>([]);
const fileLists2 = ref<UploadProps[]>([]);
const fileLists3 = ref<UploadProps[]>([]);

// 提交表单
const submitForm = () => {
     // 上传图片
  const promises = [];
  if (uploadRef1.value && typeof uploadRef1.value.submitUpload === 'function') {
    uploadRef1.value.submitUpload();
  }
  if (uploadRef2.value && typeof uploadRef2.value.submitUpload === 'function') {
    uploadRef2.value.submitUpload();
  }
  if (uploadRef3.value && typeof uploadRef3.value.submitUpload === 'function') {
    uploadRef3.value.submitUpload();
  }


  if(!form.product_info.additional_images){
    setTimeout(()=>{
      // 验证表单
      if (!formRef.value) return;
      formRef.value.validate(async(valid: boolean) => {
        if (valid) {
          // 发送请求发布商品
          await axios.post("/products", JSON.stringify(form))
            .then((response: AxiosResponse) => {
              console.log(response.data);
              ElMessage.success(response.data.data);
            })
            .catch((error) => {
              console.error('发送请求时发生错误:', error);
            });
        } else {
          console.log("错误提交!!");
          return false;
        }
      });
    },2000)
  }
  // 等待所有图片上传完成
 
      
  
};

// 重置表单
const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};

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
// 商品首页图片
function handleUploadSuccess(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 处理上传成功后的逻辑
  // 假设后端返回的 URL 存储在 response.data.url
  form.product_info.main_image = response.data;
  // console.log("图片 URL:", form.product_info.main_image);
  // console.log("图片 fileList:", fileList);
}
function handleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function handledelete(file: any, fileList: any[]) {
  console.log("删除文件", fileList);
  //清空数组
  fileLists1.value.lenght = 0;
  console.log("fileList", fileLists1.value);
}
function handleUploadchange(file: any, fileList: any[]) {
  // console.log("上传中", file, fileList);
  fileLists1.value.push(fileList[0]);
  console.log("fileList", fileLists1.value);
  // 处理上传中的逻辑
}


// 商品轮播图图片
function CarouselhandleUploadSuccess(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 假设后端返回的 URL 存储在 response.data.url
  form.product_info.additional_images.push(response.data); 

}
function CarouselhandleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function CarouselhandleUploadchange(file: any, fileList: any[]) {
  // console.log("上传中", file, fileList);
  fileLists2.value.push(file);
  // console.log("fileList", fileLists.value);
  // 处理上传中的逻辑
}
function Carouselhandledelete(file: any, fileList: any[]) {
  // console.log("剩余文件", fileList);
  // console.log("存储文件删除前", fileLists.value);
  fileLists2.value.splice(fileLists2.value.indexOf(file), 1);
  // console.log("存储文件", fileLists);
  // 处理删除文件的逻辑
}


// 商品详细图
function DetailsImagesHandleUploadSuccess(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 假设后端返回的 URL 存储在 response.data.url
  form.product_info.details_images.push(response.data);
  console.log("图片 URL:", form.product_info.details_images);
}
function DetailsImagesHandleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function DetailsImagesHandleUploadchange(file: any, fileList: any[]) {
  // console.log("上传中", file, fileList);
  fileLists3.value.push(file);
  // console.log("fileList", fileLists.value);
  // 处理上传中的逻辑
}
function DetailsImageshandledelete(file: any, fileList: any[]) {
  // console.log("剩余文件", fileList);
  // console.log("存储文件删除前", fileLists.value);
  fileLists3.value.splice(fileLists3.value.indexOf(file), 1);
  // console.log("存储文件", fileLists);
  // 处理删除文件的逻辑
}


// 初始化表单数据
onMounted(() => {
  // 可以在这里初始化表单数据
});
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.aaa {
  overflow-y: auto !important;
}

.el-form-item {
  margin: 10px 20px;
}

.justify-self-center {
  margin-top: 60px !important;
}
</style>
