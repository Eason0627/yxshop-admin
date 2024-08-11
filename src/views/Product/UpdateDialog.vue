<template>
  <el-dialog v-model="props.dialogFormVisible" title="修改产品信息" width="800">
    <el-form :model="form">

      <el-form-item label="商品名称：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.product_name" autocomplete="off" />
      </el-form-item>
      
      <el-form-item label="商品描述：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.description" type="textarea" autocomplete="off" />
      </el-form-item>

      <el-form-item label="所属品牌：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.brand_id" autocomplete="off" />
      </el-form-item>

      <el-form-item label="所属店铺：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.shop_id" autocomplete="off" />
      </el-form-item>
      
      <el-form-item label="所属分类：" :label-width="formLabelWidth">
        <el-select v-model="form.product_info.category_id" placeholder="请选择分类">
          <el-option
            v-for="item in props.categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :value="item.category_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="地域：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.origin" autocomplete="off" />
      </el-form-item>

      <el-form-item label="材质：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.material" autocomplete="off" />
      </el-form-item>

      <el-form-item label="尺寸：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.size" autocomplete="off" />
      </el-form-item>

      <el-form-item label="颜色：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.color" autocomplete="off" />
      </el-form-item>

      <el-form-item label="重量（kg）：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.weight" autocomplete="off" />
      </el-form-item>

      <el-form-item label="包装详情：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.packaging_details" autocomplete="off" />
      </el-form-item>

      <el-form-item label="保修信息：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.warranty_info" autocomplete="off" />
      </el-form-item>

      <el-form-item label="生产日期：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.production_date" autocomplete="off" />
      </el-form-item>

      <el-form-item label="保质期：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.expiration_date" autocomplete="off" />
      </el-form-item>

      <!-- <el-form-item label="保质期：" :label-width="formLabelWidth">
        <el-input v-model="form.product_info.main_image" autocomplete="off" />
      </el-form-item> -->

      <el-form-item label="商品首图：" prop="" :label-width="formLabelWidth" calss="border"  enctype="multipart/form-data">
        <el-button type="danger" @click="props.form.product_info.main_image=''">删除图片</el-button>

        <img v-if="props.form.product_info.main_image":src="props.form.product_info.main_image" class="avatar" />

        <FileUploader v-else :action="uploadUrl" :multiple="true" :auto="true" :limit="1" :before-upload="validateImage" 
          @onSuccess="handleUploadSuccess"
          @onError="handleUploadError" 
          />
          <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
      </el-form-item>

      <el-form-item label="商品轮播图：" prop="" :label-width="formLabelWidth" 
        enctype="multipart/form-data">
        <ul class="flex">
            <li v-for="(item, index) in form.product_info.additional_images" :key="index">
            <img :src="item" class="carousel-img" />
            <el-button type="danger" @click="handleCarouselDelete(index)">删除</el-button>
          </li>
        </ul>
        <FileUploader :action="uploadUrl" :multiple="true" :auto="true"  :limit="5" :before-upload="validateImage" 
          @onSuccess="CarouselhandleUploadSuccess" @onError="CarouselhandleUploadError" />
      </el-form-item>

      <el-form-item label="商品详情图：" prop="" :label-width="formLabelWidth" 
        enctype="multipart/form-data">
        <ul class="flex">
            <li v-for="(item, index) in form.product_info.details_images" :key="index">
            <img :src="item" class="carousel-img" />
            <el-button type="danger" @click="handleDetailsDelete(index)">删除</el-button>
          </li>
        </ul>
        <FileUploader :action="uploadUrl" :multiple="true" :auto="true"  :limit="5" :before-upload="validateImage" 
          @onSuccess="DetailsImagesHandleUploadSuccess" @onError="DetailsImagesHandleUploadError" />
      </el-form-item>

      <el-form-item label="标签：" prop="form.product_info.tags" :label-width="formLabelWidth">
        <div class="flex gap-2">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + New Tag
          </el-button>
        </div>
      </el-form-item>

      <!-- 销售信息 -->

      <el-form-item label="销售价格：" :label-width="formLabelWidth">
        <el-input v-model="form.product_sales.price" autocomplete="off" />
      </el-form-item>

      <el-form-item label="成本价格：" :label-width="formLabelWidth">
        <el-input v-model="form.product_sales.cost_price" autocomplete="off" />
      </el-form-item>
      
      <el-form-item label="库存数量：" :label-width="formLabelWidth">
        <el-input v-model="form.product_sales.stock_quantity" autocomplete="off" />
      </el-form-item>
      
      <el-form-item label="运费：" :label-width="formLabelWidth">
        <el-input v-model="form.product_sales.shipping_fee" autocomplete="off" />
      </el-form-item>

      <el-form-item label="销售状态：" :label-width="formLabelWidth">
        <el-select v-model="form.product_sales.sales_status" placeholder="请选择状态">
          <el-option
            v-for="item in salesStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <!-- 仓库信息 -->

      <el-form-item label="所属仓库：" :label-width="formLabelWidth">
        <el-input v-model="form.inventory.warehouse_id" autocomplete="off" />
      </el-form-item>

      <el-form-item label="安全库存量：" :label-width="formLabelWidth">
        <el-input v-model="form.inventory.safety_stock" autocomplete="off" />
      </el-form-item>

      <el-form-item label="上次补货日期：" :label-width="formLabelWidth">
        <el-input v-model="form.inventory.last_restock_date" autocomplete="off" disabled />
      </el-form-item>

      <el-form-item label=" 补货阈值：" :label-width="formLabelWidth">
        <el-input v-model="form.inventory.restock_threshold" autocomplete="off" />
      </el-form-item>
      
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitChanges">
          确定修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElInput, ElMessage } from 'element-plus';
import { reactive, ref,inject, defineProps, defineEmits, nextTick } from 'vue'
import  FileUploader  from '@/components/upload/FileUploader.vue'
import { Axios, AxiosResponse } from "axios";

// 获取 axios
const axios: Axios = inject("axios") as Axios;
// 定义接收的 prop 类型
const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
  form:{
    type: Object,
    required: true,
  },
  categoryList:{
    type: Array,
    required: true,
  }
  
});

// 定义自定义事件
const emit = defineEmits(['update:dialogFormVisible']);

// const dialogFormVisible = ref(false)
const formLabelWidth = '180px'

const uploadUrl = "http://localhost:8080/upload";


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
  props.form.product_info.main_image = response.data;
  // console.log("图片 URL:", form.product_info.main_image);
  // console.log("图片 fileList:", fileList);
}
function handleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
// 商品轮播图图片
function CarouselhandleUploadSuccess(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 假设后端返回的 URL 存储在 response.data.url
  if(props.form.product_info.additional_images.length < 5) {
    props.form.product_info.additional_images.push(response.data); 
  }
}
function CarouselhandleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function handleCarouselDelete(index: number){
  props.form.product_info.additional_images.splice(index, 1)
}
// 商品详细图
function DetailsImagesHandleUploadSuccess(response: any, file: any, fileList: any[]) {
  console.log("上传成功", response, file, fileList);
  // 假设后端返回的 URL 存储在 response.data.url
  if(props.form.product_info.details_images.length <5){
    props.form.product_info.details_images.push(response.data);
  }
  // console.log("图片 URL:", form.product_info.details_images);
}
function DetailsImagesHandleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function handleDetailsDelete (index: number){
  props.form.product_info.details_images.splice(index, 1)
}

/**tags */
const inputValue = ref('')
const dynamicTags = ref(['手机', '数码', '相机'])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  props.form.product_info.tags = [...dynamicTags.value]
  // console.log(form.product_info.tags)
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    props.form.product_info.tags = [...dynamicTags.value]
    // console.log(form.product_info.tags)
  }
  inputVisible.value = false
  inputValue.value = ''
}
/**tags */

//销售状态
const salesStatus = ref([
  { value: 'Available', label: '在售' },
  { value: 'Out of Stock', label: '缺货' },
  { value: 'Pre-order', label: '售罄' },
]);

// 关闭对话框的方法
function closeDialog() {
console.log(props.form)
  emit('update:dialogFormVisible', false);
}
//提交修改
async function submitChanges (){
  // 发送请求发布商品
  console.log( JSON.stringify(props.form))
  await axios.put(`/products/${props.form.product_info.product_id}`, props.form)
  .then((response) => {
      console.log(response.data);
      ElMessage({
          message: response.data.data,
          type: 'success',
      });
  })
  .catch((error) => {
      console.error(error);
      ElMessage.error(error.response?.data?.message || "发生未知错误");
  });
}

</script>