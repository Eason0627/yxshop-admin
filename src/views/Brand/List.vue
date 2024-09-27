<template>
  <div class="list w-full h-full p-4 pb-24">
    <div
      class="container flex flex-col w-full h-full mx-auto border-[1px] border-[--info-border-color] rounded-md overflow-y-auto bg-white"
    >
      <Query
        :tableData="brandList"
        :selectData="selectData"
        :delData="delData"
        @update:Query="updateQuery"
        @getBrandData="getBrandData"
        @search="search"
        @reSet="reSet"
      ></Query>
      <div ref="tableBox" class="tableBox flex-1">
        <el-table
          class="mt-[-1]"
          ref="multipleTableRef"
          :data="searchList.length != 0 ? searchList : brandList"
          :empty-text="'暂无数据'"
          v-loading="loading"
          :height="tableBox?.scrollHeight"
          border
          @select="handleSelect"
          @select-all="handleSelectAll"
        >
          <el-table-column
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :show-overflow-tooltip="item.type === 'text' ? true : false"
            :fixed="item.type == 'operation' ? 'right' : false"
            align="center"
            v-for="item in tableHeader"
          >
            <template v-if="item.type === 'image'" #default="scope">
              <el-image
                :src="scope.row.logo_url"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                preview-teleported
                :preview-src-list="[scope.row.logo_url]"
                fit="cover"
                style="width: 64px; height: 64px"
              />
            </template>

            <template v-if="item.type === 'user'" #default="scope">
              {{
                scope.row.owner_user ? scope.row.owner_user.nick_name : "暂无"
              }}
            </template>

            <template v-if="item.type === 'date'" #default="scope">
              {{
                scope.row.status === "Active" ? scope.row.createTime : "待审核"
              }}
            </template>

            <template v-if="item.type === 'tags'" #default="scope">
              <el-tag
                :type="
                  scope.row.status === 'Active'
                    ? 'success'
                    : scope.row.status === 'Inactive'
                    ? 'primary'
                    : 'danger'
                "
                >{{
                  scope.row.status === "Active"
                    ? "已签约"
                    : scope.row.status === "Inactive"
                    ? "待审核"
                    : "已过期"
                }}</el-tag
              >
            </template>

            <template v-if="item.type === 'operation'" #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="editRow(scope.$index, scope.row)"
                plain
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="deleteRow(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无数据"></el-empty>
          </template>
        </el-table>
      </div>
      <div
        class="tableFoot flex justify-end p-4 border-t-[1px] border-[--info-border-color] overflow-y-auto"
      >
        <el-pagination
          v-model:current-page="page.currentPage"
          v-model:page-size="page.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="self-end"
          layout="sizes, total, prev, pager, next, jumper "
          background
        >
        </el-pagination>
      </div>
    </div>
    <Dialog
      :dialogVisible="dialogVisible"
      :dialogType="dialogType"
      :brand="brand"
      @getBrandData="getBrandData"
      @update:Dialog="updateDialog"
    ></Dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 引入资源
 */
import { ref, reactive, inject, onMounted, markRaw, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { Axios, AxiosResponse } from "axios";
// import { formatDate } from "@/utils/formatDate";
import User, { Role } from "@/model/User";
import Brand from "@/model/Brand";
import Query from "./Query.vue";
import Dialog from "./Dialog.vue";
// ************************************************************************************************************
const axios: Axios = inject("axios") as Axios; /// axios 实例
const user: User = JSON.parse(localStorage.getItem("user") || "") as User; // 当前登录用户
// const userList = ref<User[]>([]);
const loading = ref(false); // 数据加载状态

const dialogVisible = ref(false); // 弹框显隐
const dialogType = ref(""); // 弹框类型
let brand = ref<Brand>({
  brand_id: "",
  shop_id: "",
  brand_name: "",
  description: "",
  logo_url: "",
}); // 弹框数据对象
const requestJSON: Record<string, any> = {};
const tableHeader = [
  {
    type: "selection",
    width: "55",
  },
  {
    label: "品牌图片",
    prop: "logo_url",
    type: "image",
  },
  {
    label: "品牌名称",
    prop: "brand_name",
    type: "default",
  },
  {
    label: "品牌描述",
    prop: "description",
    type: "text",
  },
  {
    label: "品牌状态",
    prop: "status",
    type: "tags",
  },
  {
    label: "操作",
    prop: "operation",
    width: "160",
    type: "operation",
  },
]; // 表头渲染数据
let brandList = ref<Brand[]>([]); // 表格渲染数据
let searchList = ref<Brand[]>([]); // 表格渲染数据
const selectData = ref<any>([]); // 所选数据
const page = reactive({
  pageNum: 1,
  pageSize: 10,
  currentPage: 1,
  total: 0,
}); // 数据分页配置对象
const tableBox = ref<HTMLElement>(); // tableBox容器dom对象
const multipleTableRef = ref<InstanceType<typeof ElTable>>(); // elTable 实例
// ************************************************************************************************************

// 对话框数据更新
const updateDialog = (formData: Brand | undefined, flag?: boolean) => {
  if (flag !== undefined) {
    dialogVisible.value = flag;
  }
  if (formData !== undefined) {
    brand.value = { ...formData } as Brand;
  }
};

// 搜索栏数据更新
const updateQuery = (formData?: Brand, flag?: boolean, type?: string) => {
  if (formData !== undefined) {
    brand.value = { ...formData } as Brand;
  }
  if (flag !== undefined) {
    dialogVisible.value = flag;
  }
  if (type !== undefined) {
    dialogType.value = type;
  }
};

// 搜索数据
const search = (
  key?: string,
  value?: string,
  startTime?: string,
  endTime?: string
) => {
  if (key && value) {
    searchList.value = brandList.value.filter((item: any) => {
      return item[key].includes(value);
    });
    // if (key === "nick_name") {
    //   searchList.value = brandList.value.filter((item: Brand) => {
    //     return item.owner_user && item.owner_user.nick_name.includes(value);
    //   });
    // } else {
    //   searchList.value = brandList.value.filter((item: any) => {
    //     return item[key].includes(value);
    //   });
    // }
  }
  if (startTime && endTime) {
    console.log("startTime", startTime, "endTime", endTime);
    searchList.value = brandList.value.filter((item: any) => {
      return (
        new Date(item.createTime) >= new Date(startTime) &&
        new Date(item.createTime) <= new Date(endTime)
      );
    });
  }
};
// 重置数据
const reSet = async () => {
  searchList.value = [];
  // await getData();
};

// 编辑数据项
const editRow = (index: number, row: Brand) => {
  console.log("编辑行:", index, JSON.parse(JSON.stringify(row)));
  dialogVisible.value = true;
  dialogType.value = "edit";
  brand.value = { ...row };
};

// 多选删除数据项
const deleteRow = async (index: number, row: Brand) => {
  console.log("删除行:", index, row);
  ElMessageBox.confirm("确认删除所选数据？(无法恢复！)", "删除警告", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(async () => {
      await delBrands([row.brand_id]);
    })
    .catch(() => {
      // catch error
    });
};

// 选择数据行
const handleSelect = (selection: any[]) => {
  selectData.value = selection;
};

// 全选数据
const handleSelectAll = (selection: any[]) => {
  selectData.value = selection;
};

// 删除所选数据
const delData = async () => {
  if (selectData.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  ElMessageBox.confirm("确认删除所选数据？(无法恢复！)", "删除警告", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(async () => {
      // 获取选中项的id
      const selectId = selectData.value.map((item: Brand) => {
        return item.brand_id;
      });
      // 删除数据
      await delBrands(selectId);
      selectData.value = [];
    })
    .catch(() => {
      // catch error
    });
};

// 分页
async function handleCurrentChange(val: number) {
  page.pageNum = val;
  // await getData();
}

async function handleSizeChange(val: number) {
  page.currentPage = val;
  // await getData();
}

// 根据店铺状态排序
function sortBrandStatus(list: Brand[]) {
  let first: Brand[] = [];
  let second: Brand[] = [];
  let third: Brand[] = [];
  let result: Brand[] = [];
  list.forEach((item) => {
    if (item.status == "Active") {
      first.push(item);
    } else if (item.status == "Inactive") {
      second.push(item);
    } else {
      third.push(item);
    }
  });
  result = [...first, ...second, ...third];
  return result;
}

// 获取数据
const getBrandData = async () => {
  loading.value = true;
  // 发起请求 --- 获取 品牌数据
  const currentShop = JSON.parse(localStorage.getItem("currentShop") || "");
  requestJSON.shop_id = currentShop.id;
  await axios
    .get("/brand/getBrandPagination", {
      params: {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        brand: JSON.stringify(requestJSON),
      },
    })
    .then((res: AxiosResponse<any>) => {
      console.log(res.data.data.list);
      if (res.data.data.list && res.data.data.list.length) {
        // 根据店铺状态排序
        brandList.value = res.data.data.list;
        console.log(brandList.value);
        brandList.value = sortBrandStatus(brandList.value);
      } else {
        ElMessage.warning("暂无品牌数据!");
      }
      page.total = parseInt(res.data.data.total);
    })
    .catch(() => {
      ElMessage.error("获取品牌数据失败！");
    })
    .finally(() => {
      loading.value = false;
    });
};

// 删除店铺
const delBrands = async (list: any) => {
  console.log(list);
  await axios
    .post(`/brand/delByList`, list)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success("删除品牌成功！");
        getBrandData();
      }
    })
    .catch((e) => {
      ElMessage.error("删除品牌失败！" + e.message);
    });
};

onBeforeMount(async () => {
  // 根据用户权限获取数据
  const role = user.role;
  switch (role) {
    case Role.Admin || "Admin":
      // 当前用户为管理员，获取所有信息
      await getBrandData();
      break;
    case Role.ShopOwner:
      // 当前用户为商家，商家所有信息
      await getBrandData();
      break;
    case Role.Customer:
      // 当前用户为顾客
      break;
  }
});

// 当组件挂载时执行数据请求
onMounted(() => {
  // getBrandData();
});
</script>

<style lang="scss" scoped></style>
