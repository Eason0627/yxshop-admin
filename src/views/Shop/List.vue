<template>
  <div class="list w-full h-full p-4 pb-24">
    <div
      class="content flex flex-col w-full h-full border-[1px] border-[--info-border-color] rounded-md overflow-y-auto bg-white"
    >
      <div class="title p-4 text-2xl font-bold">店铺列表</div>
      <div
        class="tools flex justify-between items-center p-4 mb-[-1px] border-[1px] border-[--info-border-color]"
      >
        <div class="search mt-2 flex flex-nowrap justify-start items-center">
          <p class="text-left">筛选条件：</p>
          <div class="option">
            <el-input
              v-model="searchText"
              style="max-width: 300px"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <template #prepend>
                <el-select
                  v-model="searchType"
                  placeholder="搜索类型"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in searchList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-input>
          </div>
          <div class="option flex items-center">
            <span class="label px-2"> 时间范围: </span>
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="handleTimeChange"
              style="width: 300px"
            />
          </div>
          <div class="option">
            <el-button type="primary" class="ml-2">搜索</el-button>
            <el-button type="danger" plain>清除</el-button>
          </div>
        </div>
        <div class="action flex items-center">
          <div
            class="tip mr-2 self-end text-sm text-[--error-color] underline cursor-pointer"
          >
            已选<span>{{ selectData.length }}</span
            >条数据
          </div>
          <div class="del">
            <el-button type="danger" plain class="mr-2" @click="delData"
              >删除所选</el-button
            >
          </div>
          <div class="add">
            <el-button
              type="primary"
              @click="(dialogVisible = true) && (dialogType = 'add')"
              >新增店铺</el-button
            >
          </div>
        </div>
      </div>
      <div class="tableBox flex-1">
        <el-table
          class="mt-[-1]"
          ref="multipleTableRef"
          :data="shopList"
          max-height="600"
          border
          @select="handleSelect"
          @select-all="handleSelectAll"
        >
          <el-table-column
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
            v-for="item in tableHeader"
          >
            <template v-if="item.type === 'image'" #default="scope">
              <el-image
                :src="scope.row.image_url"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                preview-teleported
                :preview-src-list="[scope.row.image_url]"
                fit="cover"
                style="width: 64px; height: 64px"
              />
            </template>
            <template v-if="item.type === 'operation'" #default="scope">
              <el-button
                type="primary"
                @click="editRow(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                @click="deleteRow(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        class="tableFoot flex justify-end p-4 border-t-[1px] border-[--info-border-color] overflow-y-auto"
      >
        <el-pagination
          background
          layout="total, prev, pager, next, jumper "
          @size-change="handleSizeChange"
          v-model:current-page="page.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          v-model:page-size="page.pageSize"
          :total="page.total"
          @current-change="handleCurrentChange"
          class="self-end"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" width="500" destroy-on-close>
      <template #header>
        <div class="mb-4 text-xl font-bold">新增店铺</div>
      </template>
      <div class="content flex justify-center items-center p-4">
        <el-form class="w-full" :model="shop">
          <el-form-item class="flex items-center" label="店铺图片">
            <div
              class="image flex justify-center items-center w-36 h-36 rounded-md overflow-hidden"
              v-if="shop.shop_image"
            >
              <el-image
                :src="shop.shop_image"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                preview-teleported
                :preview-src-list="[shop.shop_image]"
                fit="cover"
                style="width: 100%; height: 100%"
              />
            </div>
            <div class="upload w-24 h-24 overflow-hidden" v-else>
              <FileUploader
                action="http://localhost:8080/upload"
                :multiple="true"
                :limit="1"
                :before-upload="validateImage"
                @change="uploadChange"
                @onSuccess="success"
                @onError="error"
              />
            </div>
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
/**
 * 引入资源
 */
import { ref, reactive, inject, onMounted, markRaw } from "vue";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { Axios, AxiosResponse } from "axios";
import { formatDate } from "@/utils/formatDate";
import FileUploader from "@/components/upload/FileUploader.vue";
import Shop, { Status } from "@/model/Shop";
import User, { Role } from "@/model/User";
import { onBeforeMount } from "vue";

// ************************************************************************************************************
const axios: Axios = inject("axios") as Axios; /// axios 实例
const user: User = JSON.parse(localStorage.getItem("user") || "") as User; // 当前登录用户
const loading = ref(false); // 数据加载状态
const searchText = ref(""); // 搜索文本
const searchType = ref(""); // 搜索类型
const time = ref(""); // 时间范围展示
const searchList = [
  {
    value: "shop_name",
    label: "店铺名称",
  },
  {
    value: "user_name",
    label: "联系人",
  },
  {
    value: "phone",
    label: "联系电话",
  },
  {
    value: "location",
    label: "店铺地址",
  },
  {
    value: "shop_description",
    label: "店铺描述",
  },
]; // 搜索类型配置
const startTime = ref(""); // 开始时间
const endTime = ref(""); // 结束时间
const dialogVisible = ref(false); // 弹框显隐
const dialogType = ref(""); // 弹框类型
let shop = ref<Shop>({
  shop_id: "",
  shop_name: "",
  owner_user_id: "",
  phone: "",
  location: "",
  registration_date: "",
  shop_description: "",
  shop_image: "",
}); // 弹框数据对象
const requestJSON = {};
const tableHeader = [
  {
    type: "selection",
    width: "55",
  },
  {
    label: "店铺图片",
    prop: "shop_image",
    type: "image",
  },
  {
    label: "店铺名称",
    prop: "shop_name",
    type: "default",
  },
  {
    label: "联系人",
    prop: "username",
    type: "default",
  },
  {
    label: "联系电话",
    prop: "phone",
    type: "default",
  },
  {
    label: "店铺地址",
    prop: "location",
    type: "default",
  },
  {
    label: "注册日期",
    prop: "registration_date",
    type: "default",
  },
  {
    label: "店铺描述",
    prop: "shop_description",
    type: "default",
  },
  {
    label: "店铺状态",
    prop: "status",
    type: "default",
  },
  {
    label: "操作",
    prop: "operation",
    width: "200",
    type: "operation",
  },
]; // 表头渲染数据
//   shop_id: number | string; // 店铺ID
//   shop_name: string; // 店铺名称
//   owner_user_id: number | string; // 店铺负责人的用户ID
//   phone: string; // 联系信息
//   location: string; // 地址
//   registration_date: Date | string; // 注册日期 开店审核通过时间
//   shop_description: string; // 店铺描述
//   shop_image: string; // 店铺图片的URL
//   createTime?: Date | string; // 创建时间
//   updateTime?: Date | string; // 更新时间
//   status?: Status; // 店铺状态
let shopList = ref<Shop[]>([]); // 表格渲染数据
const selectData = ref<any>([]); // 所选数据
const editIndex = ref(0); // 编辑数据索引
const page = reactive({
  pageNum: 1,
  pageSize: 10,
  currentPage: 1,
  total: 0,
}); // 数据分页配置对象
const multipleTableRef = ref<InstanceType<typeof ElTable>>(); // elTable 实例
// ************************************************************************************************************

const handleTimeChange = (value: Array<Date>) => {
  if (!value) return;
  startTime.value = formatDate(value[0], "yyyy-MM-dd hh:mm:ss");
  endTime.value = formatDate(value[1], "yyyy-MM-dd hh:mm:ss");
};

// 模拟的事件处理函数
const editRow = (index: number, row: Shop) => {
  console.log("编辑行:", index, JSON.parse(JSON.stringify(row)));
  editIndex.value = index;
  dialogVisible.value = true;
  dialogType.value = "edit";
  shop.value = { ...row };
};

const deleteRow = (index: number, row: Shop) => {
  console.log("删除行:", index, row);
  ElMessageBox.confirm("确认删除所选数据？(无法恢复！)", "删除警告", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(() => {
      shopList.value.splice(index, 1);
    })
    .catch(() => {
      // catch error
    });
};

// 清空新增分类表单
const clearData = () => {
  shop.value = {
    shop_id: "",
    shop_name: "",
    owner_user_id: "",
    phone: "",
    location: "",
    registration_date: "",
    shop_description: "",
    shop_image: "",
    status: Status.Active,
  };
};

// 对话框取消按钮
function dialogCancel() {
  dialogVisible.value = false;
  if (dialogType.value == "add") {
    clearData();
  }
}

// 对话框确认按钮
function dialogConfirm() {
  if (dialogType.value == "add") {
    // 新增分类
    shopList.value.push(shop.value);
    clearData();
  } else if (dialogType.value == "edit") {
    shop.value.createTime = new Date();
    shop.value.updateTime = new Date();
    shopList.value.splice(editIndex.value, 1, shop.value);
  }
  clearData();
  dialogVisible.value = false;
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
  shop.value.shop_image = response.data;
}
function error(error: any, file: any, fileList: any[]) {
  console.error("上传失败", error, file, fileList);
  // 处理上传失败后的逻辑
}
function uploadChange(file: any, fileList: any[]) {
  console.log("上传图片", file, fileList);
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
      const selectId = selectData.value.map((item: Shop) => {
        return item.shop_id;
      });
      shopList.value = shopList.value.filter((item: Shop) => {
        !selectId.includes(item.shop_id);
      });
      selectData.value = [];
    })
    .catch(() => {
      // catch error
    });
};

// 分页
function handleCurrentChange(val: number) {
  page.pageNum = val;
}

function handleSizeChange(val: number) {
  page.currentPage = val;
}

// 获取数据
const getData = async () => {
  loading.value = true;
  // 发起请求
  await axios
    .get("/shops/getShopPagination", {
      params: {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        shop: JSON.stringify({}),
      },
    })
    .then((res: AxiosResponse<any>) => {
      console.log(res.data.data);
    });
};

onBeforeMount(async () => {
  // 根据用户权限获取数据
  const role = user.role;
  switch (role) {
    case Role.Admin || "Admin":
      // 当前用户为管理员，获取所有店铺信息
      await getData();
      break;
    case Role.ShopOwner:
      // 当前用户为商家，商家所有店铺信息
      break;
    case Role.Customer:
      // 当前用户为顾客
      break;
  }
});

// 当组件挂载时执行数据请求
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
