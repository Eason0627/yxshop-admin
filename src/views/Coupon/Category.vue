// ParentComponent.vue
<template>
  <div class="category w-full h-full p-4 pb-32 overflow-y-auto">
    <div class="container w-full p-8 mx-auto border-[1px] rounded-md bg-white">
      
    </div>
    <DialogForm
      :title="dialogTitle"
      :visible="dialogVisible"
      :labelPosition="'right'"
      :fields="formFields"
      @update:visible="dialogVisible = $event"
      @submit="handleFormSubmit"
      @uploadChange="uploadChange"
      @success="success"
      @error="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DialogForm from "@/components/Dialog/DialogForm.vue";
import { FormField } from "@/components/Dialog/FormField.ts";
import { ElMessage } from "element-plus";

const dialogTitle = "添加分类";
const dialogVisible = ref(false);

const formFields: FormField[] = [];




function handleFormSubmit(data: any) {
  console.log("提交的数据:", data);
  dialogVisible.value = false;
}
function showDialog() {
  dialogVisible.value = true;
  console.log(dialogVisible.value);
}
// 上传文件的 change 事件
function uploadChange(file: any, fileList: any[]) {
  console.log("上传文件变化:", file, fileList);
}

// 上传成功回调
function success(_response: any, file: any, _fileList: any) {
  ElMessage.success(`${file.name} 上传成功.`);
}

// 上传失败回调
function error(_err: any, file: any, _fileList: any) {
  ElMessage.error(`${file.name} 上传失败.`);
}
</script>
