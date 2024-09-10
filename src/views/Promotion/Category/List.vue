<template>
  <div class="list w-full h-full p-4 pb-24">
    <div
      class="container flex flex-col w-full h-full mx-auto border-[1px] border-[--info-border-color] rounded-md overflow-y-auto bg-white"
    >
      <!-- 搜索条件 -->
      <Query
        :tableData="promotionList"
        :selectData="selectData"
        :delData="delData"
        @update:Query="updateQuery"
        @getData="getData"
        @search="search"
        @reSet="reSet"
      ></Query>
      <!-- Table表格渲染区域 -->
      <div ref="tableBox" class="tableBox flex-1">
        <!-- 表格 -->
        <el-table
          class="mt-[-1]"
          ref="multipleTableRef"
          :data="searchList.length ? searchList : promotionList"
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

            <template v-if="item.type === 'tags'" #default="scope">
              <el-tag
                :type="
                  scope.row.status === true
                    ? 'success'
                    : 'danger'
                "
                >{{
                  scope.row.status === true
                    ? "已激活"
                    : "已注销"
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
      <!-- 分页 -->
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
      <!-- 弹窗 -->
      <Dialog
      :dialogVisible="dialogVisible"
      :dialogType="dialogType"
      :promotionType="promotionType"
      @getData="getData"
      @update:Dialog="updateDialog"
      ref="childRef"
      ></Dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref,reactive, markRaw, inject, onMounted, Ref, } from "vue"
//导入组件
import Query from "./Query.vue";
import Dialog from "./Dialog.vue";

// 导入model类型
import  PromotionType  from "@/model/PromotionType ";
import { ElTable, ElMessage, ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";

import { Axios, AxiosResponse } from "axios";

// axios 实例
const axios: Axios = inject("axios") as Axios; 

// 搜索结果列表
const searchList = ref<PromotionType[]>([])
//数据列表
const promotionList = ref<PromotionType[]>([])
// 数据加载状态
const loading = ref(false); 
// 表头渲染数据
const tableHeader = [
  {
    type: "selection",
    width: "55",
  },
  {
    label: "活动类型名称",
    prop: "name",
    type: "string",
  },
  {
    label: "所属店铺",
    prop: "shop_id",
    type: "String",
  },
  {
    label: "活动类型描述",
    prop: "description",
    type: "text",
  },
  {
    label: "状态",
    prop: "status",
    type: "tags",
  },
  {
    label: "创建时间",
    prop: "createTime",
    type: "string",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    type: "string",
  },
  {
    label: "操作",
    prop: "operation",
    width: "160",
    type: "operation",
  },
]; 
let promotionType = ref<PromotionType>({
  type_id: "",
  shop_id: "",
  name: "",
  description: "",
  status: true,
  createTime:"",
  updateTime: ""
})


let requestJSON: Record<string, any> = {};
// 所选数据
const selectData = ref<any>([]); 
// 数据分页配置对象
const page = reactive({
  pageNum: 1,
  pageSize: 15,
  currentPage: 1,
  total: 0,
}); 
// tableBox容器dom对象
const tableBox = ref<HTMLElement>(); 
 // elTable 实例
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// 弹框显隐
const dialogVisible = ref(false); 
// 弹框类型
const dialogType = ref(""); 

// **********************************************************************************
// 获取数据
const getData = async () => {
  loading.value = true;
  // 发起请求 --- 获取店铺数据
  requestJSON.shop_id = JSON.parse(localStorage.getItem("currentShop") || "{}").shop_id;
  // console.log(JSON.parse(localStorage.getItem("currentShop") || "{}"));
  
  await axios
    .get("/promotionType/getPromotionTypePagination", {
      params: {
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        promotionType: JSON.stringify(requestJSON),
      },
    })
    .then(async (res: AxiosResponse<any>) => {
      console.log(res.data)
      // 根据店铺状态排序
      promotionList.value = [...res.data.data.records]

      page.total = parseInt(res.data.data.total);
      loading.value = false;
     
    });

  // 获取用户数据
  // axios.get("/users")
};

const childRef: Ref<any> = ref(null);
// 对话框数据更新
const updateDialog = (formData: PromotionType | undefined, flag?: boolean) => {
  if (flag !== undefined) {
    dialogVisible.value = flag;
  }
  if (formData !== undefined) {
    promotionType.value = { ...formData } as PromotionType;
  }
};

// 搜索栏数据更新
const updateQuery = (formData?: PromotionType, flag?: boolean, type?: string) => {
  if (formData !== undefined) {
    promotionType.value = { ...formData } as PromotionType;
  }
  if (flag !== undefined) {
    dialogVisible.value = flag;
  }
  if (type !== undefined) {
    dialogType.value = type;
  }
};

// 搜索数据
const search = async (
  key?: string,
  value?: string,
  startTime?: string,
  endTime?: string
) => {
  if (key && value) {
    requestJSON[key] = value;
    // console.log(requestJSON);
  }
  if (startTime && endTime) {
    // console.log("startTime", startTime, "endTime", endTime);
    requestJSON["start_date"] = startTime;
    requestJSON["end_date"] = endTime;
    console.log(requestJSON);

    // searchList.value = shopList.value.filter((item: any) => {
    //   return (
    //     new Date(item.createTime) >= new Date(startTime) &&
    //     new Date(item.createTime) <= new Date(endTime)
    //   );
    // });
  }
  await getData();
};
// 重置数据
const reSet = async () => {
  searchList.value = [];
  requestJSON = {};
  await getData();
};

// 模拟的事件处理函数
const editRow = (index: number, row: PromotionType) => {
  console.log("编辑行:", index, JSON.parse(JSON.stringify(row)));
  dialogVisible.value = true;
  dialogType.value = "edit";
  promotionType.value = { ...row };
};

const deleteRow = async (index: number, row: PromotionType) => {
  console.log("删除行:", index, row);
  ElMessageBox.confirm("确认删除所选数据？(无法恢复！)", "删除警告", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(async () => {
      await delPromotion([row.type_id]);
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
      const selectId = selectData.value.map((item: { type_id: any; }) => item.type_id)
      // 删除数据
      await delPromotion(selectId);
      selectData.value = [];
    })
    .catch(() => {
      // catch error
    });
};

// 删除数据
  const delPromotion = async (list: any) => {
  await axios
    .post("/promotionType/delPromotionType", list)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success("删除活动成功！");
        getData();
      }else{
        ElMessage.error("删除活动失败！"+res.data.msg);
      }
    })
    .catch((e) => {
      ElMessage.error("删除活动失败！" + e.message);
    });
};
// 分页
async function handleCurrentChange(val: number) {
  page.pageNum = val;
  await getData();
}

async function handleSizeChange(val: number) {
  page.currentPage = val;
  await getData();
}

onMounted(() => {
  getData();
});
</script>
<style lang="scss" scoped>




</style>
