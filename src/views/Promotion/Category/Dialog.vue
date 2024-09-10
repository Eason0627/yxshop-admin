<template>
  <el-dialog
    v-model="dialogVisible"
    width="600"
    @close="onCancel"
    destroy-on-close
  >
    <template #header>
      <div class="mb-4 text-xl font-bold">{{dialogType==='add'?'新增活动类型':'修改活动类型'}}</div>
    </template>
    <div class="content flex justify-center items-center p-4">
      <el-form
        ref="promotionFormRef"
        class="w-full"
        label-position="left"
        label-width="100px"
        :model="promotionType"
        :rules="rules"
        v-if="promotionType"
      >
     
        <el-form-item label="活动标题" prop="name" required>
          <el-input
            v-model="promotionType.name"
            placeholder="请输入活动标题名称"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="绑定店铺" prop="shop_id" required>
          <el-select v-model="promotionType.shop_id" placeholder="选择店铺">
            <el-option :label="shop.shop_name" :value="shop.shop_id" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动描述" prop="description" required>
          <el-input
            v-model="promotionType.description"
            placeholder="请输入描述语言"
            clearable
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="是否激活" prop="status" >
          <el-select v-model="promotionType.status" placeholder="选择是否生效活动">
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
import PromotionType from "@/model/PromotionType ";


// 传参数据类型
interface Props {
  dialogVisible?: boolean;
  dialogType?: string;
  promotionType?: PromotionType | undefined;
  //   onConfirm: (shopFormRef: FormInstance | undefined) => boolean;
  //   onCancel: () => void;
}

// 自定义事件
interface Emits {
  (e: "getData"): void;
  (e: "update:Dialog", formData: PromotionType | undefined, flag?: boolean): void;
}

// 参数默认值
const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  dialogType: "add",
  promotionType: undefined,
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
// const innerVisible = ref(false)//二次弹窗显隐
const promotionType = ref<PromotionType>();//活动数据

// const selectedItems= ref<string>('');

// const values = ref('')

// const cities =ref([] as Option[]);//商品列表(二次弹窗)
// const typeList = ref([] as OptionType[])//活动类型列表
// const selectedProducts = ref([]); // 已选中的项的 product_id 的数组

// interface Option {
//   key: string
//   label: string
//   value: string
// }
// interface OptionType {
//   label: string
//   value: string
// }

// const userList = ref<User[]>([]);
const promotionFormRef = ref<FormInstance>();
const rules = reactive<FormRules<PromotionType>>({
  name: [
    { required: true, message: "请输入活动类型名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  shop_id: [
    { required: true, message: "请选择店铺", trigger: "change" },
  ],
  description: [
    { required: true, message: "请输入店铺描述", trigger: "blur" },
    { min: 2, max: 100, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
});



// 清空新增分类表单
const clearData = () => {
  promotionType.value = {
    shop_id: "",
    name: "",
    description: "",
    status: true,
    createTime: "",
    updateTime: "",
  };
};

// 对话框取消按钮
function onCancel() {
  clearData();
  emit("update:Dialog", promotionType.value, false);
}

//格式化日期函数
// function formatDate(dateStr: string | number | Date) {
//       // 假设输入格式为 YYYY-MM-DDTHH:mm:ss.SSSZ
//       const date = new Date(dateStr);
//       const year = date.getUTCFullYear();
//       const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//       const day = String(date.getUTCDate()).padStart(2, '0');
//       const hours = String(date.getUTCHours()).padStart(2, '0');
//       const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//       const seconds = String(date.getUTCSeconds()).padStart(2, '0');

//       return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//     }

// 对话框确认按钮
async function onConfirm(promotionFormRef: FormInstance | undefined) {
  // console.log(promotionFormRef)
  if (!promotionFormRef) return;
  await promotionFormRef.validate((valid: any) => {
    if (valid) {
      console.log("表单验证正确！", promotionType.value);
      
      
      console.log(promotionType.value );
      
      if (dialogType.value == "add") {
          // 添加店铺
          addPromotion().then(() => {
            // 清除表单数据
            promotionFormRef.resetFields();
            clearData();
            emit("update:Dialog", promotionType.value, false);
          });
       
      } else if (dialogType.value == "edit") {
        
            updatePromotion().then(() => {
              // 清除表单数据
              promotionFormRef.resetFields();
              clearData();
              emit("update:Dialog", promotionType.value, false);
            });

        } else {
          updatePromotion().then(() => {
            // 清除表单数据
            promotionFormRef.resetFields();
            clearData();
            emit("update:Dialog", promotionType.value, false);
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
  // 新增
  await axios
    .post("/promotionType", promotionType.value)
    .then((res: AxiosResponse) => {
      if (res.data.code == 200) { 
        ElMessage.success("新增活动类型成功！");
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
    .put(`/promotionType/${promotionType.value?.type_id}`, promotionType.value)
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
  promotionType.value = props.promotionType;
})

onMounted(() => {
  // getAvailableProductList()
})

</script>

<style lang="scss" scoped></style>
