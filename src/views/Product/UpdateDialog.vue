<template>
  <el-dialog
    v-model="dialogVisible"
    @close="closeDialog()"
    title="修改产品信息"
    width="1000"
  >
    <el-form
      class="flex flex-col"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="80px"
      enctype="multipart/form-data"
    >
      <div class="content px-8">
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">商品图片</div>
        </div>
        <!-- 图片组 -->
        <div class="item-group grid grid-cols-1 gap-4 px-8">
          <el-form-item
            prop="product_info.main_image"
            class="col-span-1"
            label-width="120px"
            required
          >
            <template #label>
              <div class="label flex items-center">
                <span class="text mr-2">商品首图</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="只能上传一张"
                  placement="bottom"
                >
                  <el-icon>
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            
            <ShowImg :images="[form.product_info.main_image]" :propStr="'main_image'" @deleteImage=""></ShowImg>
            <FileUploader
              :action="uploadUrl"
              :multiple="true"
              :limit="1"
              :props-str="'main'"
              :before-upload="validateImage"
              ref="uploadRef1"
              @onSuccess="uploadSuccess"
              @onError="uploadError"
              @change="uploadChange"
              @update:modelValue="uploadValue"
            />
          </el-form-item>

          <el-form-item
            prop="product_info.additional_images"
            class="col-span-1"
            label-width="120px"
            required
          >
            <template #label>
              <div class="label flex items-center">
                <span class="text mr-2">商品轮播图</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="只能上传五张"
                  placement="bottom"
                >
                  <el-icon>
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
       
            <ShowImg :images="form?.product_info.additional_images" :propStr="'additional_images'" @removeImage=""></ShowImg>
            <FileUploader
              :action="uploadUrl"
              :multiple="true"
              :limit="5-(form?.product_info?.additional_images?.length||0)"
              :before-upload="validateImage"
              :props-str="'carousel'"
              ref="uploadRef2"
              @onSuccess="uploadSuccess"
              @onError="uploadError"
              @change="uploadChange"
              @update:modelValue="uploadValue"
            />
          </el-form-item>

          <el-form-item
            prop="product_info.details_images"
            class="col-span-1"
            label-width="120px"
            required
          >
            <template #label>
              <div class="label flex items-center">
                <span class="text mr-2">商品详情图</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="只能上传五张"
                  placement="bottom"
                >
                  <el-icon>
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            
            <ShowImg :images="form?.product_info.details_images" :propStr="'details_images'" @removeImage=""></ShowImg>
            <FileUploader
              :action="uploadUrl"
              :multiple="true"
              :limit="5-(form?.product_info?.details_images?.length||0)"
              :before-upload="validateImage"
              :props-str="'details'"
              ref="uploadRef3"
              @onSuccess="uploadSuccess"
              @onError="uploadError"
              @change="uploadChange"
              @update:modelValue="uploadValue"
            />
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">基础信息</div>
        </div>
        <!-- 名称 & 描述 -->
        <div class="item-group grid grid-cols-1 px-8">
          <el-form-item label="商品名称" prop="product_info.product_name">
            <el-input
              v-model="form?.product_info.product_name"
              placeholder="请输入商品名称"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="商品描述" prop="product_info.description">
            <el-input
              v-model="form?.product_info.description"
              type="textarea"
              placeholder="请输入商品描述"
              style="width: 300px"
            />
          </el-form-item>
        </div>

        <!-- 下拉选择项 -->
        <div class="item-group grid grid-cols-3 gap-4 px-8">
          <el-form-item label="品牌名称" prop="product_info.brand_id" required >
            <!-- <el-input v-model.number="form.product_info.brand_id" placeholder="请输入品牌ID" /> -->
            <el-select
              v-model="form?.product_info.brand_id"
              placeholder="选择品牌"
              @focus="handleBrand()"
            >
              <el-option
                v-for="brand in brandList"
                :key="brand.brand_id"
                :label="brand.brand_name"
                :value="brand.brand_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属店铺" prop="product_info.shop_id" required>
            <!-- <el-input v-model.number="form.product_info.shop_id" placeholder="请输入店铺ID" /> -->
            <el-select
              v-model="form?.product_info.shop_id"
              placeholder="选择店铺"
              @focus="handleBrand()"
            >
              <el-option
                v-for="shop in shopList"
                :key="shop.shop_id"
                :label="shop.shop_name"
                :value="shop.shop_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="商品分类"
            prop="product_info.category_id"
            required
            @focus="handleCategory()"
          >
            <el-select
              v-model="form?.product_info.category_id"
              placeholder="选择分类"
              
            >
              <el-option
                v-for="category in categoryList"
                :key="category.category_id"
                :label="category.category_name"
                :value="category.category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="生产日期"
            prop="product_info.production_date"
            required
          >
            <el-date-picker
              v-model="form?.product_info.production_date"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item
            label="保质期"
            prop="product_info.expiration_date"
            required
          >
            <el-date-picker
              v-model="form?.product_info.expiration_date"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </div>
        <!-- 标签行 -->
        <div class="item-group grid grid-cols-1 px-8">
          <el-form-item prop="product_info.tags" required>
            <template #label>
              <div class="label flex items-center">
                <span class="text mr-2">标签</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="使用逗号  ,  分隔"
                  placement="bottom"
                >
                  <el-icon>
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <!-- <el-input v-model="form.product_info.tags" placeholder="请输入标签" /> -->
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
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
              >
                + New Tag
              </el-button>
            </div>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <!-- 其他信息 -->
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">其它信息</div>
        </div>
        <div class="item-group grid grid-cols-4 gap-4 px-8">
          <el-form-item label="产地" prop="product_info.origin">
            <el-input
              v-model="form?.product_info.origin"
              placeholder="请输入原产地"
            />
          </el-form-item>

          <el-form-item label="材质" prop="product_info.material">
            <el-input
              v-model="form?.product_info.material"
              placeholder="请输入材质"
            />
          </el-form-item>

          <el-form-item label="尺寸" prop="product_info.size">
            <el-input
              v-model="form?.product_info.size"
              placeholder="请输入尺寸"
            />
          </el-form-item>

          <el-form-item label="颜色" prop="product_info.color">
            <el-input
              v-model="form?.product_info.color"
              placeholder="请输入颜色"
            />
          </el-form-item>

          <el-form-item label="重量" prop="product_info.weight">
            <el-input
              v-model.number="form?.product_info.weight"
              placeholder="请输入重量"
            />
          </el-form-item>

          <el-form-item label="包装详情" prop="product_info.packaging_details">
            <el-input
              v-model="form?.product_info.packaging_details"
              placeholder="请输入包装详情"
            />
          </el-form-item>

          <el-form-item label="保修信息" prop="product_info.warranty_info">
            <el-input
              v-model="form?.product_info.warranty_info"
              placeholder="请输入保修信息"
            />
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <!-- 销售信息 -->
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">销售参数</div>
        </div>
        <div class="item-group grid grid-cols-5 gap-4 px-8">
          <el-form-item
            class="col-span-2"
            label="促销详情"
            prop="product_sales.promotion_details"
            required
          >
            <el-input
              v-model="form?.product_sales.promotion_details"
              placeholder="请输入促销详情"
            />
          </el-form-item>
          <el-form-item label="商品价格" prop="product_sales.price" required>
            <el-input
              v-model.number="form?.product_sales.price"
              placeholder="请输入商品价格"
            />
          </el-form-item>

          <el-form-item
            label="成本价格"
            prop="product_sales.cost_price"
            required
          >
            <el-input
              v-model.number="form?.product_sales.cost_price"
              placeholder="请输入成本价格"
            />
          </el-form-item>
          <el-form-item
            label="物流单价"
            prop="product_sales.shipping_fee"
            required
          >
            <el-input
              v-model.number="form?.product_sales.shipping_fee"
              placeholder="请输入运费"
            />
          </el-form-item>
          <el-form-item
            class="col-span-2"
            label="库存数量"
            prop="product_sales.stock_quantity"
            required
          >
            <el-input-number
              v-model="form?.product_sales.stock_quantity"
              controls-position="right"
              :min="0"
              placeholder="请输入库存数量"
            />
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <!-- 仓储信息 -->
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">仓储信息</div>
        </div>
        <div class="item-group grid grid-cols-3 gap-4 px-8">
          <el-form-item label="仓库名称" prop="inventory.warehouse_id" required>
            <!-- <el-input v-model.number="form.inventory.warehouse_id" placeholder="请输入仓库ID" /> -->
            <el-select
              v-model="form?.inventory.warehouse_id"
              placeholder="选择仓库"
              @focus="handleBrand()"
            >
              <el-option
                v-for="warehouse in warehouseList"
                :key="warehouse.warehouse_id"
                :label="warehouse.warehouse_name"
                :value="warehouse.warehouse_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="安全库存" prop="inventory.safety_stock" required>
            <el-input
              v-model.number="form?.inventory.safety_stock"
              placeholder="请输入安全库存量"
            />
          </el-form-item>

          <el-form-item
            label="补货阈值"
            prop="inventory.restock_threshold"
            required
          >
            <el-input
              v-model.number="form?.inventory.restock_threshold"
              placeholder="请输入补货阈值"
            />
          </el-form-item>
        </div>
        <el-divider></el-divider>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitChanges"> 确定修改 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElInput, ElMessage } from "element-plus";
// import { Delete } from "@element-plus/icons-vue";
import {
  ref,
  inject,
  defineProps,
  defineEmits,
  nextTick,
  // onMounted,
  // watchEffect,
reactive,
watch,
} from "vue";
import FileUploader from "@/components/upload/FileUploader.vue";
import { Axios, AxiosResponse } from "axios";
import Brand from "@/model/Brand";
import Shop from "@/model/Shop";
import Warehouse from "@/model/Warehouse";
import Category from "@/model/Category";
import FormModel  from "@/model/ProductType";


//导入展示图片组件
import ShowImg from "@/components/upload/ShowImg.vue"

// 获取 axios
const axios: Axios = inject("axios") as Axios;

// const dialogVisible = ref(false);
// // 在组件中使用该类型
// const form = ref< FormModel| null>(null);

// 定义接收的 prop 类型
interface Props {
  form?: FormModel;
  dialogVisible?: boolean;
}

const props = defineProps<Props>();

// 定义自定义事件
const emit = defineEmits(["update:Visible"]);

// watchEffect(() => {
//   dialogVisible.value = props.dialogVisible;
//   console.log("弹窗值"+dialogVisible.value);
//   if (props.form) {
//     console.log("赋值前"+props.form);
//     form.value = {...props.form };
//     console.log("form"+form);
//   } 
// });

// 使用ref来响应式地存储对话框可见性和表单数据  
const dialogVisible = ref(props.dialogVisible || false);  
const form = ref<FormModel | null>(null);  
  
// 使用watch来监听props变化  
watch(() => props.dialogVisible, (newValue) => {  
  dialogVisible.value = newValue;  
  console.log("弹窗值: " + dialogVisible.value);  
});  
  
watch(() => props.form, (newValue) => {  
  if (newValue) {  
    // 使用JSON.parse(JSON.stringify())或_.cloneDeep进行深拷贝  
    form.value = JSON.parse(JSON.stringify(newValue));  
    console.log("form赋值后: ", form.value);  
  }  
}, {  
  deep: true, // 如果FormModel是复杂的对象或数组，需要开启深度监听  
});  

const uploadUrl = "http://localhost:8080/upload";

const deleteMainImage = () => {
  form.product_info.main_image = "";
};
const deleteCarouselImage = (index: any) => {
  console.log(index);
  form.product_info.additional_images.splice(index, 1);
};
const deleteDetailsImage = (index: any) => {
  console.log(index);
  form.product_info.details_images.splice(index, 1);
};

// 表单验证规则
const rules = reactive({
  "product_info.product_name": [
    { required: true, message: "请输入商品名称", trigger: "blur" },

  ],
  "product_info.description": [
    { required: true, message: "请输入描述", trigger: "blur" },
    { maxLength: 500, message: "描述不能超过500个字符", trigger: "blur" }
  ],
  "product_info.brand_id": [
    { required: true, message: "请选择品牌", trigger: "blur" },
    // { type: 'number', message: "品牌ID必须是数字", trigger: "blur" }
  ],
  "product_info.shop_id": [
    { required: true, message: "请选择店铺", trigger: "blur" },
    // { type: 'number', message: "店铺ID必须是数字", trigger: "blur" }
  ],
  "product_info.origin": [
    { required: true, message: "请输入产地", trigger: "blur" },
    // { pattern: /^中国$/, message: "产地必须是中国", trigger: "blur" }
  ],
  "product_info.material": [
    { required: true, message: "请输入材质", trigger: "blur" },
    // { type: 'number', message: "材质代码必须是数字", trigger: "blur" }
  ],
  "product_info.size": [
    { required: true, message: "请输入尺寸", trigger: "blur" },
    { type: 'number', message: "尺寸必须是数字", trigger: "blur" },
    // { minValue: 0, message: "尺寸不能小于0", trigger: "blur" }
  ],
  "product_info.color": [
    { required: true, message: "请输入颜色", trigger: "blur" }
  ],
  "product_info.weight": [
    { required: true, message: "请输入重量", trigger: "blur" },
    { type: 'number', message: "重量必须是数字", trigger: "blur" },
    // { minValue: 0, message: "重量不能小于0", trigger: "blur" }
  ],
  "product_info.packaging_details": [
    { required: true, message: "请输入包装详情", trigger: "blur" }
  ],
  "product_info.warranty_info": [
    { required: true, message: "请输入保修信息", trigger: "blur" }
  ],
  "product_info.production_date": [
    { required: true, message: "请输入生产日期", trigger: "blur" },
    { type: 'date', message: "生产日期必须是有效的日期格式", trigger: "blur" },
  ],
  "product_info.expiration_date": [
    { required: true, message: "请输入过期日期", trigger: "blur" },
    { type: 'date', message: "过期日期必须是有效的日期格式", trigger: "blur" },
    
  ],
  "product_info.category_id": [
    { required: true, message: "请选择分类", trigger: "blur" },
    // { type: 'number', message: "分类ID必须是数字", trigger: "blur" }
  ],
  "product_sales.price": [
    { required: true, message: "请输入价格", trigger: "blur" },
    { type: 'number', message: "价格必须是数字", trigger: "blur" },
    // { minValue: 0, message: "价格不能小于0", trigger: "blur" }
  ],
  "product_sales.cost_price": [
    { required: true, message: "请输入成本价", trigger: "blur" },
    { type: 'number', message: "成本价必须是数字", trigger: "blur" },
    // { minValue: 0, message: "成本价不能小于0", trigger: "blur" }
  ],
  "product_sales.stock_quantity": [
    { required: true, message: "请输入库存数量", trigger: "blur" },
    { type: 'number', message: "库存数量必须是数字", trigger: "blur" },
    // { minValue: 0, message: "库存数量不能小于0", trigger: "blur" }
  ],
  "product_sales.reorder_threshold": [
    { required: true, message: "请输入补货阈值", trigger: "blur" },
    { type: 'number', message: "补货阈值必须是数字", trigger: "blur" },
    // { minValue: 0, message: "补货阈值不能小于0", trigger: "blur" }
  ],
  "product_sales.sold_quantity": [
    { required: true, message: "请输入已售数量", trigger: "blur" },
    { type: 'number', message: "已售数量必须是数字", trigger: "blur" },
    // { minValue: 0, message: "已售数量不能小于0", trigger: "blur" }
  ],
  "product_sales.review_count": [
    { required: true, message: "请输入评价数量", trigger: "blur" },
    { type: 'number', message: "评价数量必须是数字", trigger: "blur" },
    // { minValue: 0, message: "评价数量不能小于0", trigger: "blur" }
  ],
  "product_sales.average_rating": [
    { required: true, message: "请输入平均评分", trigger: "blur" },
    { type: 'number', message: "平均评分必须是数字", trigger: "blur" },
    // { minValue: 0, message: "平均评分不能小于0", trigger: "blur" },
    // { maxValue: 5, message: "平均评分不能超过5", trigger: "blur" }
  ],
  "product_sales.promotion_details": [
    { message: "请输入促销详情", trigger: "blur" }
  ],
  "product_sales.shipping_fee": [
    { required: true, message: "请输入运费", trigger: "blur" },
    { type: 'number', message: "运费必须是数字", trigger: "blur" },
    // { minValue: 0, message: "运费不能小于0", trigger: "blur" }
  ]
});

// 响应式引用数组
const brandList = ref<Brand[]>([]);
// const brandList = ref([]);
const shopList = ref<Shop[]>([]);
const warehouseList = ref<Warehouse[]>([]);
const categoryList = ref<Category[]>([]);

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
// 2. 上传成功
function uploadSuccess(
  response?: any,
  file?: any,
  fileList?: any[],
  props?: string
) {
  console.log("上传成功", response, file, fileList);
  if (props === "main") {
    form.value.product_info.main_image = file;
  } else if (props === "carousel") {
    form.value.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.value.product_info.details_images = fileList as string[];
  }
}

// 3. 上传失败
function uploadError(
  error?: any,
  file?: any,
  fileList?: any[],
  props?: string
) {
  console.error("上传失败", error, file, fileList);
  if (props === "main") {
    form.value.product_info.main_image = file;
  } else if (props === "carousel") {
    form.value.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.value.product_info.details_images = fileList as string[];
  }
}

// 更新数据
function uploadValue(file?: any, fileList?: any[], props?: string) {
  console.log("删除文件", file, fileList);
  if (props === "main") {
    form.value.product_info.main_image = file;
  } else if (props === "carousel") {
    form.value.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.value.product_info.details_images = fileList as string[];
  }
}

// 文件上传中
function uploadChange( file?: any, fileList?: any[], props?: string) {
  console.log("上传中", file, fileList, props);
  if (props === "main") {
    form.value.product_info.main_image = file;
  } else if (props === "carousel") {
    form.value.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.value.product_info.details_images = fileList as string[];
  }
}


/**tags */
const inputValue = ref("");
const dynamicTags = ref(["手机", "数码", "相机"]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  // props.form.product_info?.tags = [...dynamicTags.value];
  // console.log(form.product_info.tags)
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    // props.form.product_info.tags = [...dynamicTags.value];
    // console.log(form.product_info.tags)
  }
  inputVisible.value = false;
  inputValue.value = "";
};
/**tags */

//销售状态
const salesStatus = ref([
  { value: "Available", label: "在售" },
  { value: "Out of Stock", label: "缺货" },
  { value: "Pre-order", label: "售罄" },
]);

// 关闭对话框的方法
function closeDialog() {
  emit("update:Visible", false);
  dialogVisible.value = false;
}


//提交修改
async function submitChanges() {
  // 发送请求发布商品
  console.log(JSON.stringify(props.form));
  // delete props.form.inventory.last_restock_date
  // 解析日期字符串
  const date = new Date(props.form.inventory.last_restock_date);

  // 检查日期是否有效
  if (!isNaN(date.getTime())) {
    // 格式化日期
    const formattedDate = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    props.form.inventory.last_restock_date = formattedDate;
    // 展示日期
    console.log(formattedDate); // 输出: 1970-01-01
  } else {
    console.error("Invalid date string");
  }
  console.log(props.form.inventory.last_restock_date);

  await axios
    .put(`/products/${props.form.product_info.product_id}`, props.form)
    .then((response: AxiosResponse) => {
      console.log(response.data);
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      closeDialog();
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error(error.response?.data?.message || "发生未知错误");
    })
    .finally(() => {
      emit("update:Visible", false);
    });
}

interface Item {
warehouse_name: any;
warehouse_id: any;
  brand_id?: number;
  brand_name?: string;
  shop_id?: number;
  shop_name?: string;
}
//请求品牌、仓库、店铺
const handleBrand = async () => {
  // console.log(brandList)
  if(!brandList){return}
  const user = JSON.parse(localStorage.getItem("user") || "");
  console.log("开始获取店铺品牌")
  await axios
    .get(`/products/commentsByUserId/${user.id}`)
    .then((response: AxiosResponse) => {
      const Data: Item[] = response.data.data;
      // console.log(Data);
      // 去重函数
      const removeDuplicates = <T>(arr: T[], key: keyof T): T[] => {
        const seen = new Set<string>();
        return arr.filter((item) => {
          const value = item[key];
          if (value && !seen.has(value)) {
            seen.add(value);
            return true;
          }
          return false;
        });
      };
      // 处理去重品牌
      const brandListData: Brand[] = removeDuplicates(
        Data.filter((item) => item.brand_name && item.brand_id).map((item) => ({
          brand_id: item.brand_id!,
          brand_name: item.brand_name!,
        })),
        "brand_id"
      );

      // 处理去重店铺
      const shopListData: Shop[] = removeDuplicates(
        Data.filter((item) => item.shop_name && item.shop_id).map((item) => ({
          shop_id: item.shop_id!,
          shop_name: item.shop_name!,
        })),
        "shop_id"
      );

      // 处理去重仓库
      const warehouseListData: Warehouse[] = removeDuplicates(
        Data.filter((item) => item.warehouse_name && item.warehouse_id).map(
          (item) => ({
            warehouse_id: item.warehouse_id!,
            warehouse_name: item.warehouse_name!,
          })
        ),
        "warehouse_id"
      );
      brandList.value = brandListData;
      shopList.value = shopListData;
      warehouseList.value = warehouseListData;

      // console.log(brandList.value)
      // console.log(shopList.value)
      // console.log(warehouseList.value)
    })
    .catch((error: any) => {
      console.error(error);
    });
};
//请求分类id列表
const handleCategory = async () => {
  // console.log(categoryList);
  
  if(!categoryList){return}
  await axios
    .get("/category", {
      params: {
        shop_id: props.form.product_info.shop_id,
      },
    })
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

// 初始化表单数据
// onMounted(() => {
//   // 可以在这里初始化表单数据
//   handleBrand();
//   handleCategory();
// });


</script>
