<!-- DialogForm.vue -->
<template>
  <el-dialog :title="title" v-model="visible" @close="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-position="labelPosition"
      label-width="120px"
    >
      <template v-for="field in fields">
        <el-form-item
          :label="field.label"
          :prop="field.prop"
          :rules="field.rules"
        >
          <el-input
            v-if="field.type === 'textarea'"
            type="textarea"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
          ></el-input>
          <FileUploader
            v-else-if="field.type === 'uploader'"
            :action="field.uploadConfig.uploadAction"
            :multiple="field.uploadConfig.multiple"
            :limit="field.uploadConfig.limit"
            :before-upload="validateImage"
            @change="uploadChange"
            @onSuccess="success"
            @onError="error"
          />
          <component
            :is="getFieldComponent(field.type)"
            v-model="formData[field.prop]"
            :options="field.options"
            v-bind="$attrs"
            :placeholder="field.placeholder"
            @change="handleChange"
            v-else
          >
            <!-- 添加子元素以支持 el-radio-group 和 el-checkbox-group -->
            <template
              v-if="field.type === 'radio' || field.type === 'checkbox'"
            >
              <component
                v-for="option in field.options"
                :key="option.value"
                :is="field.type === 'radio' ? 'el-radio' : 'el-checkbox'"
                :label="option.label"
                :value="option.value"
              />
            </template>
          </component>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { ElForm, FormInstance, ElMessage, FormRules } from "element-plus";
import { FormField, DialogFormProps } from "./FormField";
import FileUploader from "@/components/upload/FileUploader.vue";

const props = withDefaults(defineProps<DialogFormProps>(), {
  title: "",
  visible: false,
  labelPosition: "left",
  fields: () => [],
});

const emit = defineEmits([
  "update:visible",
  "submit",
  "uploadChange",
  "success",
  "error",
]);

const formRef = ref<FormInstance>();
const formData = reactive<any>({});
const rules = reactive<FormRules>({});

const title = ref(props.title);
const visible = ref(props.visible);
const labelPosition = ref(props.labelPosition);
const fields = ref<FormField[]>(props.fields);

function getFieldComponent(type: string) {
  switch (type) {
    case "text":
      return "el-input";
    case "number":
      return "el-input-number";
    case "select":
      return "el-select";
    case "datepicker":
      return "el-date-picker";
    case "radio":
      return "el-radio-group";
    case "checkbox":
      return "el-checkbox-group";
    case "uploader":
      return "FileUploader";
    default:
      return "el-input";
  }
}

// 验证表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit("submit", formData);
      emit("update:visible", false);
    } else {
      ElMessage.error("验证失败");
    }
  });
}

// 上传文件前的验证
function validateImage(file: any) {
  const isJPG = file.type === "image/jpeg";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传图片只能是 JPG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
}

// 上传文件的 change 事件
function uploadChange(file: any, fileList: any[]) {
  emit("uploadChange", file, fileList);
}

// 上传成功回调
function success(_response: any, file: any, fileList: any) {
  emit("success", file, fileList);
}

// 上传失败回调
function error(_err: any, file: any, fileList: any) {
  emit("error", file, fileList);
}

// 关闭对话框
const closeDialog = () => {
  // 重置数据
  formRef.value?.resetFields();
  emit("update:visible", false);
};

// 监听 props 数据变化
watchEffect(() => {
  if (props.visible) {
    title.value = props.title;
    visible.value = props.visible;
    labelPosition.value = props.labelPosition;
    fields.value = props.fields;
  }
});

// 处理表单字段的 change 事件
function handleChange(event: any) {
  console.log("表单字段变化:", event);
}
</script>

<style scoped>
.el-input,
.el-select,
.el-textarea {
  width: 100%;
  max-width: 300px;
}

.el-textarea {
  max-width: 500px;
}
</style>
