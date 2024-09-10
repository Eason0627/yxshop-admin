<template>
  <el-dialog
    v-model="dialogVisible"
    width="600"
    @close="onCancel"
    destroy-on-close
  >
    <template #header>
      <div class="mb-4 text-xl font-bold">{{dialogType==='add'?'新增活动':'修改活动'}}</div>
    </template>
    <div class="content flex justify-center items-center p-4">
      <el-form
        ref="promotionFormRef"
        class="w-full"
        label-position="left"
        label-width="100px"
        :model="promotion"
        :rules="rules"
        v-if="promotion"
      >
     
        <el-form-item label="活动标题" prop="title" required>
          <el-input
            v-model="promotion.title"
            placeholder="请输入活动标题名称"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="绑定店铺" prop="shop_id" required>
          <el-select v-model="promotion.shop_id" placeholder="选择店铺">
            <el-option :label="shop.shop_name" :value="shop.shop_id" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动描述" prop="description" required>
          <el-input
            v-model="promotion.description"
            placeholder="请输入描述语言"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="绑定类型"  prop="type_id" required>
          <el-select v-model="promotion.type_id" placeholder="设置类型" @focus="getTypeList()">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="有效时间" prop="start_date" >
          
          <el-date-picker
            v-model="values"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="A hh:mm:ss"
          />
        </el-form-item>
      
        <el-form-item label="打几折" prop="discount" required>
          <el-input
            v-model="promotion.discount"
            placeholder="请输入..."
            type="number"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="最低消费" prop="minimum_spend" required>
          <el-input
            v-model="promotion.minimum_spend"
            placeholder="请输入..."
            type="number"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="最高消费" prop="maximum_spend" required>
          <el-input
            v-model="promotion.maximum_spend"
            placeholder="请输入..."
            type="number"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="可用商品" >
          <el-button type="primary" @click="getAvailableProductList">点击选择可用商品</el-button>
          <el-dialog
            v-model="innerVisible"
            width="600"
            title="选择可用商品"
            append-to-body
            center
          >
          <el-transfer
            v-model="promotion.product_id"
            filterable
            filter-placeholder="搜索产品"
            :data="cities"
            :titles="['待选商品', '已选商品']"
            :props="{
              key: 'value',
              label: 'label',
            }"
           
           
            
          />
          </el-dialog>
        </el-form-item>

        <el-form-item label="是否激活" prop="status" >
          <el-select v-model="promotion.status" placeholder="选择是否生效活动">
            <el-option label="激活" value="true" />
            <el-option label="暂不激活" value="false" />
          </el-select>
        </el-form-item>

      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm(promotionFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect,onMounted } from "vue";
// import Shop from "@/model/Shop";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import axios from "@/utils/axios";
import { AxiosResponse } from "axios";
// import User from "@/model/User";
import Promotion from "@/model/Promotion";


// 传参数据类型
interface Props {
  dialogVisible?: boolean;
  dialogType?: string;
  promotion?: Promotion | undefined;
  //   onConfirm: (shopFormRef: FormInstance | undefined) => boolean;
  //   onCancel: () => void;
}

// 自定义事件
interface Emits {
  (e: "getData"): void;
  (e: "update:Dialog", formData: Promotion | undefined, flag?: boolean): void;
}

// 参数默认值
const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  dialogType: "add",
  promotion: undefined,
  onConfirm: () => true,
  onCancel: () => {},
});

// defineExpose({getAvailableProductList})

const emit = defineEmits<Emits>();

interface Shop {
  shop_name?: string,
  shop_id?: number|string;
}

const shop = JSON.parse(localStorage.getItem("currentShop") || "") as Shop; // 当前登录用户



const dialogVisible = ref(false); // 弹框显隐
const dialogType = ref(""); // 弹框类型
const innerVisible = ref(false)//二次弹窗显隐
const promotion = ref<Promotion>();//活动数据

// const selectedItems= ref<string>('');

const values = ref('')

const cities =ref([] as Option[]);//商品列表(二次弹窗)
const typeList = ref([] as OptionType[])//活动类型列表
// const selectedProducts = ref([]); // 已选中的项的 product_id 的数组

interface Option {
  key: string
  label: string
  value: string
}
interface OptionType {
  label: string
  value: string
}

// const userList = ref<User[]>([]);
const promotionFormRef = ref<FormInstance>();
const rules = reactive<FormRules<Promotion>>({
  // shop_name: [
  //   { required: true, message: "请输入店铺名称", trigger: "blur" },
  //   { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  // ],
  // owner_user_id: [
  //   { required: true, message: "请选择店铺负责人", trigger: "change" },
  // ],
  // phone: [
  //   { required: true, message: "请输入联系电话", trigger: "blur" },
  //   { min: 11, max: 11, message: "请输入正确的11位手机号码", trigger: "blur" },
  // ],
  // location: [
  //   { required: true, message: "请输入店铺地址", trigger: "blur" },
  //   { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  // ],
  // shop_description: [
  //   { required: true, message: "请输入店铺描述", trigger: "blur" },
  //   { min: 2, max: 100, message: "长度在 2 到 20 个字符", trigger: "blur" },
  // ],
  // shop_image: [{ required: true, message: "请上传店铺图片", trigger: "blur" }],
  // status: [
  //   { required: true, message: "请选择店铺负责人", trigger: "change" },
  // ],
});



//获取店铺活动类型请求函数
async function getTypeList() {
  if(typeList.value.length !== 0)return;
  await axios
  .get(`/promotionType/list/${shop.shop_id}`)
  .then((response: AxiosResponse) => {
    if(response.data.data.length == 0)return ElMessage.error("该店铺，活动类型无数据");
    typeList.value = response.data.data
    .filter((item: { status: boolean; }) => item.status === true)
    .map((item: { type_id: any; name: any; }) => ({
      value: item.type_id,
      label: item.name
    }));
    // console.log(typeList.value);
  })
  .catch((error: any) => {
     console.error(error);
     ElMessage.error("获取店铺活动类型失败");
  })
}

//获取可用商品列表请求函数
async function getAvailableProductList() {
  innerVisible.value = true
  // if(cities.value.length > 0)return;
  await axios
  .get(`/products/list?shop_id=${shop.shop_id}`)
  .then((response: AxiosResponse) => {
    if(response.data.data.length == 0)return ElMessage.error("该店��，可用商品无数据");
    cities.value = response.data.data.map((item: any) => ({
      value: item.product_id,
      label: item.product_name,
    }));
    console.log(cities.value);
    
  })
  .catch((error: any) => {
     console.error(error);
     ElMessage.error("获取可用商品列表失败");
   });
}
//获取旗下店铺的活动类型


// 清空新增分类表单
const clearData = () => {
  promotion.value = {
    promotion_id: "",
    shop_id: "",
    title: "",
    minimum_spend: 0,
    discount: 0,
    description: "",
    status: true,
    start_date: "",
    end_date: "",
    product_id: ""
  };
};

// 对话框取消按钮
function onCancel() {
  clearData();
  emit("update:Dialog", promotion.value, false);
}

//格式化日期函数
function formatDate(dateStr: string | number | Date) {
      // 假设输入格式为 YYYY-MM-DDTHH:mm:ss.SSSZ
      const date = new Date(dateStr);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
// 对话框确认按钮
async function onConfirm(promotionFormRef: FormInstance | undefined) {
  // console.log(promotionFormRef)
  if (!promotionFormRef) return;
  await promotionFormRef.validate((valid: any) => {
    if (valid) {
      console.log("表单验证正确！", promotion.value);
      const str = `[${promotion.value?.product_id}]`;
      if (promotion.value) {
        // 正常赋值
        promotion.value.product_id = str;
      }
      // 确保 promotion.value 存在且为对象类型
      if (promotion.value && typeof promotion.value === 'object') {
        promotion.value.start_date = formatDate(values.value[0]);
      }
          // 确保 promotion.value 存在并设置 end_date 属性
      if (promotion.value) {
        promotion.value.end_date = formatDate(values.value[1]); // 使用直接赋值而非索引访问
      }
      console.log(promotion.value );
      
      if (dialogType.value == "add") {
          // 添加店铺
          addPromotion().then(() => {
            // 清除表单数据
            promotionFormRef.resetFields();
            clearData();
            emit("update:Dialog", promotion.value, false);
          });
       
      } else if (dialogType.value == "edit") {
        
            updatePromotion().then(() => {
              // 清除表单数据
              promotionFormRef.resetFields();
              clearData();
              emit("update:Dialog", promotion.value, false);
            });

        } else {
          updatePromotion().then(() => {
            // 清除表单数据
            promotionFormRef.resetFields();
            clearData();
            emit("update:Dialog", promotion.value, false);
          });
        }
      
    } else {
      // console.log("缺失参数", fields);
      ElMessage.error("请填写完整信息！")
    }
  })
}
  


// 请求接口添加活动
async function addPromotion() {
  // console.log(JSON.stringify(promotion.value));
  // JSON.stringify(promotion.value?.product_id)
  // 新增店铺
  await axios
    .post("/promotion", promotion.value)
    .then((res: AxiosResponse) => {
      if (res.data.code == 200) { 
        ElMessage.success("新增活动成功！");
        emit("getData");
      }
    })
    .catch(() => {
      ElMessage.error("添加失败！");
    });
}

// 请求接口更新活动·信息
async function updatePromotion() {
  // 更新店铺
  await axios
    .put(`/promotion/${promotion.value?.promotion_id}`, promotion.value)
    .then((res: AxiosResponse) => {
      if (res.data.code == 200) {
        ElMessage.success("更新活动成功！");
        emit("getData");
      }
    })
    .catch(() => {
      ElMessage.error("更新活动失败！");
    });
}


watchEffect(() => {
  dialogVisible.value = props.dialogVisible;
  dialogType.value = props.dialogType;
  promotion.value = props.promotion;
})

onMounted(() => {
  // getAvailableProductList()
})

</script>

<style lang="scss" scoped></style>
