<template>
  <div class="publish w-full h-full p-4 pb-24 overflow-y-auto">
    <div class="container flex w-full mx-auto">
      <div
        class="template fixed w-[200px] max-h-[666px] px-8 py-4 border-[1px] border-[--info-border-color] rounded-md bg-white overflow-y-auto"
      >
        <!-- 模板列表 -->
        <div class="list min-h-[1000px]">
          <!-- 已保存的模板 -->
          <!-- 模板草稿 -->
          <!-- 模板回收站 -->
        </div>
      </div>
      <div
        class="form flex-1 px-8 py-4 ml-[216px] border-[1px] border-[--info-border-color] rounded-md bg-white"
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
                <FileUploader
                  :action="uploadUrl"
                  :multiple="true"
                  :limit="1"
                  :props-str="'main'"
                  :before-upload="validateImage"
                  @onSuccess="uploadSuccess"
                  @onError="uploadError"
                  @change="uploadChange"
                  @update:modelValue="uploadValue"
                  ref="uploadMainRef"
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
                <FileUploader
                  :action="uploadUrl"
                  :multiple="true"
                  :limit="5"
                  :props-str="'carousel'"
                  :before-upload="validateImage"
                  @onSuccess="uploadSuccess"
                  @onError="uploadError"
                  @change="uploadChange"
                  @update:modelValue="uploadValue"
                  ref="uploadCarouselRef"
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
                <FileUploader
                  :action="uploadUrl"
                  :multiple="true"
                  :limit="5"
                  :props-str="'details'"
                  :before-upload="validateImage"
                  @onSuccess="uploadSuccess"
                  @onError="uploadError"
                  @change="uploadChange"
                  @update:modelValue="uploadValue"
                  ref="uploadDetailsRef"
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
                  v-model="form.product_info.product_name"
                  placeholder="请输入商品名称"
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item label="商品描述" prop="product_info.description">
                <el-input
                  v-model="form.product_info.description"
                  type="textarea"
                  placeholder="请输入商品描述"
                  style="width: 300px"
                />
              </el-form-item>
            </div>

            <!-- 下拉选择项 -->
            <div class="item-group grid grid-cols-3 gap-4 px-8">
              <el-form-item
                label="品牌名称"
                prop="product_info.brand_id"
                required
              >
                <!-- <el-input v-model.number="form.product_info.brand_id" placeholder="请输入品牌ID" /> -->
                <el-select
                  v-model="form.product_info.brand_id"
                  placeholder="请选择品牌"
                >
                  <el-option
                    v-for="brand in brandList"
                    :key="brand.brand_id"
                    :label="brand.brand_name"
                    :value="brand.brand_id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="店铺名称"
                prop="product_info.shop_id"
                required
              >
                <!-- <el-input v-model.number="form.product_info.shop_id" placeholder="请输入店铺ID" /> -->
                <el-select
                  v-model="form.product_info.shop_id"
                  placeholder="选择店铺"
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
              >
                <el-select
                  v-model="form.product_info.category_id"
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
                  v-model="form.product_info.production_date"
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
                  v-model="form.product_info.expiration_date"
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
                  v-model="form.product_info.origin"
                  placeholder="请输入原产地"
                />
              </el-form-item>

              <el-form-item label="材质" prop="product_info.material">
                <el-input
                  v-model="form.product_info.material"
                  placeholder="请输入材质"
                />
              </el-form-item>

              <el-form-item label="尺寸" prop="product_info.size">
                <el-input
                  v-model="form.product_info.size"
                  placeholder="请输入尺寸"
                />
              </el-form-item>

              <el-form-item label="颜色" prop="product_info.color">
                <el-input
                  v-model="form.product_info.color"
                  placeholder="请输入颜色"
                />
              </el-form-item>

              <el-form-item label="重量" prop="product_info.weight">
                <el-input
                  v-model.number="form.product_info.weight"
                  placeholder="请输入重量"
                />
              </el-form-item>

              <el-form-item
                label="包装详情"
                prop="product_info.packaging_details"
              >
                <el-input
                  v-model="form.product_info.packaging_details"
                  placeholder="请输入包装详情"
                />
              </el-form-item>

              <el-form-item label="保修信息" prop="product_info.warranty_info">
                <el-input
                  v-model="form.product_info.warranty_info"
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
                  v-model="form.product_sales.promotion_details"
                  placeholder="请输入促销详情"
                />
              </el-form-item>
              <el-form-item
                label="商品价格"
                prop="product_sales.price"
                required
              >
                <el-input
                  v-model.number="form.product_sales.price"
                  placeholder="请输入商品价格"
                />
              </el-form-item>

              <el-form-item
                label="成本价格"
                prop="product_sales.cost_price"
                required
              >
                <el-input
                  v-model.number="form.product_sales.cost_price"
                  placeholder="请输入成本价格"
                />
              </el-form-item>
              <el-form-item
                label="物流单价"
                prop="product_sales.shipping_fee"
                required
              >
                <el-input
                  v-model.number="form.product_sales.shipping_fee"
                  placeholder="请输入运费"
                />
              </el-form-item>
              <el-form-item
                label="库存数量"
                prop="product_sales.stock_quantity"
                required
              >
                <el-input-number
                  v-model="form.product_sales.stock_quantity"
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
              <el-form-item
                label="仓库名称"
                prop="inventory.warehouse_id"
                required
              >
                <!-- <el-input v-model.number="form.inventory.warehouse_id" placeholder="请输入仓库ID" /> -->
                <el-select
                  v-model="form.product_info.warehouse_id"
                  placeholder="选择仓库"
                >
                  <el-option
                    v-for="warehouse in warehouseList"
                    :key="warehouse.warehouse_id"
                    :label="warehouse.warehouse_name"
                    :value="warehouse.warehouse_id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label="安全库存"
                prop="inventory.safety_stock"
                required
              >
                <el-input
                  v-model.number="form.inventory.safety_stock"
                  placeholder="请输入安全库存量"
                />
              </el-form-item>

              <el-form-item
                label="补货阈值"
                prop="inventory.restock_threshold"
                required
              >
                <el-input
                  v-model.number="form.inventory.restock_threshold"
                  placeholder="请输入补货阈值"
                />
              </el-form-item>
            </div>
            <el-divider></el-divider>
            <div class="action flex justify-end">
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="openDialog">发布商品</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      width="500"
      :close="dialogClose"
      align-center
    >
      <template #title>
        <div class="title flex items-center text-md font-bold font-sans">
          <el-icon><Warning /></el-icon>
          <span class="ml-2">提示</span>
        </div>
      </template>
      <div class="py-4 font-bold text-[var(--warning-color)]">
        <span>确认提交商品信息？</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onConfirm" :loading="loading">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted, nextTick } from "vue";
import { Axios, AxiosResponse } from "axios";
import { ElMessage, ElInput, FormInstance } from "element-plus";
import FileUploader from "@/components/upload/FileUploader.vue";

// 获取 axios
const axios: Axios = inject("axios") as Axios;

const uploadUrl = "http://localhost:8080/upload";
// 数据模型
interface ProductInfo {
  warehouse_id: unknown;
  product_name: string;
  description: string;
  brand_id: string;
  shop_id: string;
  origin: string;
  material: string;
  size: string;
  color: string;
  weight: number;
  packaging_details: string;
  warranty_info: string;
  production_date: string;
  expiration_date: string;
  category_id: string;
  main_image: string;
  additional_images: string[];
  details_images: string[];
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

// 定义品牌类型
interface Brand {
  brand_id: string;
  brand_name: string;
}
// 定义店铺类型
interface Shop {
  shop_id: string;
  shop_name: string;
}
// 定义仓库类型
interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
}
//定义分类类型
interface Category {
  category_id: number;
  category_name: string;
}

interface Item {
  brand_name: string | null;
  shop_name: string | null;
  warehouse_name: string | null;
  user_id: string | null;
  brand_id: string | null;
  shop_id: string | null;
  warehouse_id: string | null;
}

const form: FormModel = ref({
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
    // last_restock_date: "2024-02-25",
    restock_threshold: 400,
  },
});
// 表单引用
const formRef = ref<FormInstance>();
// 上传组件对象
const uploadMainRef = ref();
const uploadCarouselRef = ref();
const uploadDetailsRef = ref();

// 表单验证规则
const rules = reactive({
  "product_info.product_name": [
    { required: true, message: "请输入商品名称", trigger: "blur" },
  ],
  "product_info.description": [
    { required: true, message: "请输入描述", trigger: "blur" },
  ],
  "product_info.brand_id": [
    { required: true, message: "请选择品牌", trigger: "blur" },
  ],
  "product_info.shop_id": [
    { required: true, message: "请选择店铺", trigger: "blur" },
  ],
  // 添加更多验证规则...
});

// 响应式引用数组
const brandList = ref<Brand[]>([]);
const shopList = ref<Shop[]>([]);
const warehouseList = ref<Warehouse[]>([]);
const categoryList = ref<Category[]>([]);

/**tags */
const inputValue = ref("");
const dynamicTags = ref(["手机", "数码", "相机"]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

// 上传提示对话框
const dialogVisible = ref(false);
const loading = ref(false);

// 打开对话框
const openDialog = () => {
  dialogVisible.value = true;
};

// 对话框关闭
const dialogClose = () => {
  dialogVisible.value = false;
};

// 点击提交按钮
const onConfirm = async () => {
  loading.value = true;
  await submitForm();
};

// 删除标签
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  form.product_info.tags = [...dynamicTags.value];
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
    form.product_info.tags = [...dynamicTags.value];
    // console.log(form.product_info.tags)
  }
  inputVisible.value = false;
  inputValue.value = "";
};
/**tags */

// 提交表单
const submitForm = async () => {
  try {
    // 验证表单
    if (!formRef.value) return;
    const isValid = await formRef.value.validate();
    if (isValid) {
      const formData = new FormData();

      // 获取表单字段
      const formFields = formRef.value.fields;
      formFields.forEach((field) => {
        let name = field.prop;
        const value = field.fieldValue;

        if (name === "product_info.main_image") {
          formData.append("main_image", value.raw);
        } else if (
          name === "product_info.additional_images" ||
          name === "product_info.details_images"
        ) {
          name = name.split("product_info.")[1];
          if (Array.isArray(value)) {
            value.forEach((file) => {
              formData.append(`${name}`, file.raw); // 注意这里append的名字相同，后端需要支持处理同名的文件数组
            });
          }
        }
      });
      formData.append("formParams", JSON.stringify(form));

      // 发送请求发布商品
      await axios
        .post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const timer = setInterval(() => {
            if (res.data.code === 200) {
              clearInterval(timer);
              loading.value = false;
            }
          }, 200);
          if (res.data.code === 200) {
            ElMessage({
              message: res.data.data,
              type: "success",
            });
          } else {
            ElMessage({
              message: res.data.message || "未知错误",
              type: "error",
            });
          }
        })
        .catch((_error: any) => {
          ElMessage({
            message: "添加失败",
            type: "error",
          });
        });
    } else {
      ElMessage({
        message: "表单验证失败",
        type: "warning",
      });
    }
  } catch (error) {
    ElMessage({
      message: "添加失败, 缺少必要信息！！！",
      type: "error",
    });
  } finally {
    loading.value = false;
    dialogVisible.value = false;
  }
};

// 重置表单
const resetForm = () => {
  if (!formRef.value) return;
  formRef.value?.resetFields();
};

// 图片上传相关函数
// 1. 上传前验证图片格式
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
    form.product_info.main_image = file;
  } else if (props === "carousel") {
    form.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.product_info.details_images = fileList as string[];
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
    form.product_info.main_image = file;
  } else if (props === "carousel") {
    form.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.product_info.details_images = fileList as string[];
  }
}

// 更新数据
function uploadValue(file?: any, fileList?: any[], props?: string) {
  console.log("删除文件", file, fileList);
  if (props === "main") {
    form.product_info.main_image = file;
  } else if (props === "carousel") {
    form.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.product_info.details_images = fileList as string[];
  }
}

// 文件上传中
function uploadChange(file?: any, fileList?: any[], props?: string) {
  console.log("上传中", file, fileList, props);
  if (props === "main") {
    
    form.value.product_info.main_image = file;
  } else if (props === "carousel") {
    form.value.product_info.additional_images = fileList as string[];
  } else if (props === "details") {
    form.value.product_info.details_images = fileList as string[];
  }
}

// 获取当前用户已签约的品牌
const getBrandList = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "");

  await axios
    .get(`/products/commentsbyuserid/${user.id}`)
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

// 初始化表单数据
onMounted(() => {
  // 可以在这里初始化表单数据
  // handleBrand();
  // handleCategory();
});
</script>

<style scoped></style>
