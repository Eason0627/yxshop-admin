<template>
  <el-dialog
    v-model="props.dialogVisible"
    @close="closeDialog()"
    title="修改产品信息"
    width="1000"
  >
    <el-form
      class="flex flex-col"
      ref="formRef"
      :model="props.form"
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
            <div
              v-if="props.form.product_info.main_image"
              class="flex flex-col items-center mx-1"
            >
              <el-image
                style="width: 5rem; height: 5rem"
                :src="props.form.product_info.main_image"
              />
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                class="mt-[3px]"
                @click="deleteMainImage"
              />
            </div>
            <FileUploader
              v-else
              :action="uploadUrl"
              :multiple="true"
              :limit="1"
              :before-upload="validateImage"
              ref="uploadRef1"
              @onSuccess="handleUploadSuccess"
              @onError="handleUploadError"
              @change="handleUploadchange"
              @update:modelValue="handledelete"
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
            <div
              v-if="props.form.product_info.additional_images"
              v-for="(item, index) in props.form.product_info.additional_images"
              class="flex flex-col items-center mx-1"
            >
              <el-image style="width: 5rem; height: 5rem" :src="item" />
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                class="mt-[3px]"
                @click="deleteCarouselImage(index)"
              />
            </div>
            <FileUploader
              :action="uploadUrl"
              :multiple="true"
              :limit="5"
              :before-upload="validateImage"
              ref="uploadRef2"
              @onSuccess="CarouselhandleUploadSuccess"
              @onError="CarouselhandleUploadError"
              @change="CarouselhandleUploadchange"
              @update:modelValue="Carouselhandledelete"
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
            <div
              v-if="props.form.product_info.details_images"
              v-for="(item, index) in props.form.product_info.details_images"
              class="flex flex-col items-center mx-1"
            >
              <el-image style="width: 5rem; height: 5rem" :src="item" />
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                class="mt-[3px]"
                @click="deleteDetailsImage(index)"
              />
            </div>
            <FileUploader
              :action="uploadUrl"
              :multiple="true"
              :limit="5"
              :before-upload="validateImage"
              @change="DetailsImagesHandleUploadchange"
              ref="uploadRef3"
              @onSuccess="DetailsImagesHandleUploadSuccess"
              @onError="DetailsImagesHandleUploadError"
              @update:modelValue="DetailsImageshandledelete"
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
          <el-form-item label="品牌名称" prop="product_info.brand_id" required>
            <!-- <el-input v-model.number="form.product_info.brand_id" placeholder="请输入品牌ID" /> -->
            <el-select
              v-model="form.product_info.brand_id"
              placeholder="选择品牌"
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

          <el-form-item label="包装详情" prop="product_info.packaging_details">
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
          <el-form-item label="商品价格" prop="product_sales.price" required>
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
            class="col-span-2"
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
          <el-form-item label="仓库名称" prop="inventory.warehouse_id" required>
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

          <el-form-item label="安全库存" prop="inventory.safety_stock" required>
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
import { Delete } from "@element-plus/icons-vue";
import {
  ref,
  inject,
  defineProps,
  defineEmits,
  nextTick,
  onMounted,
  watchEffect,
} from "vue";
import FileUploader from "@/components/upload/FileUploader.vue";
import { Axios, AxiosResponse } from "axios";

// 获取 axios
const axios: Axios = inject("axios") as Axios;
// 定义接收的 prop 类型
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  form: {
    type: Object,
    required: true,
  },
});

// 定义自定义事件
const emit = defineEmits(["update:Visible"]);

const dialogVisible = ref(false);

const uploadUrl = "http://localhost:8080/upload";

const deleteMainImage = () => {
  props.form.product_info.main_image = "";
};
const deleteCarouselImage = (index: any) => {
  console.log(index);
  props.form.product_info.additional_images.splice(index, 1);
};
const deleteDetailsImage = (index: any) => {
  console.log(index);
  props.form.product_info.details_images.splice(index, 1);
};

// 响应式引用数组
const brandList = ref<Brand[]>([]);
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

function handledelete(file: any, fileList: any[]) {
  console.log("删除文件", file, fileList);
  //清空数组
  // console.log("fileList", fileList.value);
}
function handleUploadchange(file: any, fileList: any[]) {
  console.log("上传中", file, fileList);
  // fileLists1.value.push(fileList[0]);
  // console.log("fileList", fileLists1.value);
  // 处理上传中的逻辑
}
// 商品轮播图图片
function CarouselhandleUploadSuccess(
  response: any,
  file: any,
  fileList: any[]
) {
  console.log("上传成功", response, file, fileList);
  // 假设后端返回的 URL 存储在 response.data.url
  props.form.product_info.additional_images.push(response.data);
}
function CarouselhandleUploadError(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function CarouselhandleUploadchange(file: any, fileList: any[]) {
  console.log("上传中", file, fileList);
  // console.log("fileList", fileLists.value);
  // 处理上传中的逻辑
}
function Carouselhandledelete(file: any, fileList: any[]) {
  console.log("剩余文件", fileList, file);

  // 处理删除文件的逻辑
}

// 商品详细图
function DetailsImagesHandleUploadSuccess(
  response: any,
  file: any,
  fileList: any[]
) {
  console.log("上传成功", response, file, fileList);
  // 假设后端返回的 URL 存储在 response.data.url
  props.form.product_info.details_images.push(response.data);
  // console.log("图片 URL:", form.product_info.details_images);
}
function DetailsImagesHandleUploadError(
  error: any,
  file: any,
  fileList: any[]
) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function DetailsImagesHandleUploadchange(file: any, fileList: any[]) {
  console.log("上传中", file, fileList);
  // fileLists3.value.push(file);
  // console.log("fileList", fileLists.value);
  // 处理上传中的逻辑
}
function DetailsImageshandledelete(file: any, fileList: any[]) {
  console.log("剩余文件", fileList);
  console.log("存储文件删除前", file);
}

/**tags */
const inputValue = ref("");
const dynamicTags = ref(["手机", "数码", "相机"]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  props.form.product_info.tags = [...dynamicTags.value];
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
    props.form.product_info.tags = [...dynamicTags.value];
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

// 全局变量来存储待上传的文件
let fileToUpload: File | null = null;
// 图片上传函数
const uploadImage = async () => {
  //判断是否有图片
  const formData = new FormData();
  formData.append("file", fileToUpload);
  console.log(formData);
  await axios
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res: AxiosResponse) => {
      category.value!.image_url = res.data.data;
      fileToUpload = null;
    });
};
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

//请求品牌、仓库、店铺
const handleBrand = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "");

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

watchEffect(() => {
  dialogVisible.value = props.dialogVisible;
  // if (props.dialogVisible) {
  //   handleBrand();
  //   handleCategory();
  // }
});
</script>
