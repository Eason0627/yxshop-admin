<template>
  <div class="container h-screen mx-auto bg-white m-[20px] p-3 shadow-lg aaa">
    <el-form
      class="grid grid-flow-row-dense grid-cols-2 overflow-y-auto"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="120px"
      enctype="multipart/form-data"
    >
      <!-- 商品信息 -->
      <h3 class="text-xl col-span-2">商品信息</h3>
      <el-form-item
        label="商品名称"
        prop="product_info.product_name"
        class="col-span-1 px-2"
      >
        <el-input
          v-model="form.product_info.product_name"
          placeholder="请输入商品名称"
        />
      </el-form-item>

      <el-form-item
        label="商品描述"
        prop="product_info.description"
        class="col-span-1 px-2"
      >
        <el-input
          v-model="form.product_info.description"
          type="textarea"
          placeholder="请输入商品描述"
        />
      </el-form-item>

      <el-form-item
        label="品牌ID"
        prop="product_info.brand_id"
        class="col-span-1 px-2"
      >
        <el-input
          v-model.number="form.product_info.brand_id"
          placeholder="请输入品牌ID"
        />
      </el-form-item>

      <el-form-item
        label="店铺ID"
        prop="product_info.shop_id"
        class="col-span-1 px-2"
      >
        <el-input
          v-model.number="form.product_info.shop_id"
          placeholder="请输入店铺ID"
        />
      </el-form-item>

      <el-form-item
        label="原产地"
        prop="product_info.origin"
        class="col-span-1 px-2"
      >
        <el-input
          v-model="form.product_info.origin"
          placeholder="请输入原产地"
        />
      </el-form-item>

      <el-form-item
        label="材质"
        prop="product_info.material"
        class="col-span-1 px-2"
      >
        <el-input
          v-model="form.product_info.material"
          placeholder="请输入材质"
        />
      </el-form-item>

      <el-form-item
        label="尺寸"
        prop="product_info.size"
        class="col-span-1 px-2"
      >
        <el-input v-model="form.product_info.size" placeholder="请输入尺寸" />
      </el-form-item>

      <el-form-item
        label="颜色"
        prop="product_info.color"
        class="col-span-1 px-2"
      >
        <el-input v-model="form.product_info.color" placeholder="请输入颜色" />
      </el-form-item>

      <el-form-item
        label="重量"
        prop="product_info.weight"
        class="col-span-1 px-2"
      >
        <el-input
          v-model.number="form.product_info.weight"
          placeholder="请输入重量"
        />
      </el-form-item>

      <el-form-item
        label="包装详情"
        prop="product_info.packaging_details"
        class="col-span-1 px-2"
      >
        <el-input
          v-model="form.product_info.packaging_details"
          placeholder="请输入包装详情"
        />
      </el-form-item>

      <el-form-item
        label="保修信息"
        prop="product_info.warranty_info"
        class="col-span-1 px-2"
      >
        <el-input
          v-model="form.product_info.warranty_info"
          placeholder="请输入保修信息"
        />
      </el-form-item>

      <el-form-item
        label="生产日期"
        prop="product_info.production_date"
        class="col-span-1 px-2"
      >
        <el-date-picker
          v-model="form.product_info.production_date"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>

      <el-form-item
        label="保质期"
        prop="product_info.expiration_date"
        class="col-span-1 px-2"
      >
        <el-date-picker
          v-model="form.product_info.expiration_date"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>

      <el-form-item
        label="商品分类ID"
        prop="product_info.category_id"
        class="col-span-1 px-2"
      >
        <el-input
          v-model.number="form.product_info.category_id"
          placeholder="请输入商品分类ID"
        />
      </el-form-item>

      <el-form-item
        label="商品首图"
        prop="product_info.main_image"
        class="col-span-1 px-2"
        enctype="multipart/form-data"
      >
        <FileUploader
          :action="uploadUrl"
          :multiple="true"
          :limit="3"
          :before-upload="validateImage"
          @onSuccess="handleUploadSuccess"
          @onError="handleUploadError"
        />
      </el-form-item>
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
  tags: string;
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
  product_info: ProductInfo;
  product_sales: ProductSales;
  inventory: Inventory;
}

const form: FormModel = reactive({
  product_info: {
    product_name: "",
    description: "",
    brand_id: 0,
    shop_id: 0,
    origin: "",
    material: "",
    size: "",
    color: "",
    weight: 0,
    packaging_details: "",
    warranty_info: "",
    production_date: "",
    expiration_date: "",
    category_id: 0,
    main_image: "",
    additional_images: [],
    details_images: [],
    tags: "",
  },
  product_sales: {
    price: 0,
    cost_price: 0,
    stock_quantity: 0,
    reorder_threshold: 0,
    sold_quantity: 0,
    review_count: 0,
    average_rating: 0,
    promotion_details: "",
    shipping_fee: 0,
  },
  inventory: {
    warehouse_id: 0,
    stock_quantity: 0,
    safety_stock: 0,
    last_restock_date: "",
    restock_threshold: 0,
  },
});

// 表单引用
const formRef = ref<HTMLInputElement | null>(null);

const uploadRef = ref<UploadInstance>();

// 表单验证规则
const rules = reactive({
  "product_info.product_name": [
    { required: true, message: "请输入商品名称", trigger: "blur" },
  ],
  // 添加更多验证规则...
});

// 提交表单
const submitForm = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid) {
      // 发送请求发布商品
      console.log("发布商品:", form);
      // 发送请求到后端
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

// 重置表单
const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};


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

function handleUploadSuccess(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 处理上传成功后的逻辑
  // 假设后端返回的 URL 存储在 response.data.url
  const imageUrl = response.data;
  console.log("图片 URL:", imageUrl);
}

function handleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
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
</style>
