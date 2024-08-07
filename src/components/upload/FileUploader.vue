<template>
  <el-upload 
    ref="uploadRef"
    :action="uploadAction" :multiple="multiple" :headers="headers" :limit="limit" :file-list="fileList"
    :auto-upload="auto" :on-change="handleChange" :on-remove="handleRemove" :before-upload="beforeUpload"
    :on-exceed="handleExceed" :on-success="handleSuccess" :on-error="handleError" list-type="picture-card"
    :class="{ 'is-disabled': disabled }">
    <el-icon>
      <UploadFilled />
    </el-icon>
    <span @click= "submitUpload"></span>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { ElMessage } from "element-plus";

interface Props {
  disabled?: boolean;
  action?: string;
  multiple?: boolean;
  limit?: number;
  auto?: boolean;
  beforeUpload?: (file: any) => boolean;
  onSuccess?: (response: any, file: any, fileList: any[]) => void;
  onError?: (error: any, file: any, fileList: any[]) => void;
}

interface Emits {
  (e: "change", file: any, fileList: any[]): void;
  (e: "update:modelValue", file: any, fileList: any[]): void;
  (e: "onSuccess", response: any, file: any, fileList: any[]): void;
  (e: "onError", error: any, file: any, fileList: any[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  action: "",
  multiple: false,
  limit: 5,
  auto: false,
  beforeUpload: () => true,
  onSuccess: () => { },
  onError: () => { },
});

const emit = defineEmits<Emits>();

const fileList = ref<any[]>([]);
const uploadAction = ref(props.action);
const uploadRef = ref(null);

const headers = ref({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});
// 监听 action 变化
watchEffect(() => {
  uploadAction.value = props.action;
});

// 提交上传
const submitUpload =  () => {
  if (uploadRef.value) {
     uploadRef.value.submit();
  }
};


defineExpose({
  submitUpload,
});
function handleChange(file: any, fileList: any) {
  emit("change", file, fileList);
}

function handleRemove(file: any, fileList: any) {
  fileList.value = fileList.filter((f: any) => f.uid !== file.uid);
  emit("update:modelValue", file, fileList.value);
}

function handleExceed(files: any, fileList: any) {
  ElMessage.warning(
    `当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length
    } 个文件，共选择了 ${files.length + fileList.length} 个文件`
  );
}

function beforeUpload(file: any): boolean {
  if (typeof props.beforeUpload === "function") {
    return props.beforeUpload(file);
  }
  return true;
}

function handleSuccess(response: any, file: any, fileList: any[]) {
  // 调用父组件的 onSuccess 方法
  emit("onSuccess", response, file, fileList);
}

function handleError(error: any, file: any, fileList: any[]) {
  // 调用父组件的 onError 方法
  emit("onError", error, file, fileList);
}
</script>

<style scoped>
.is-disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
