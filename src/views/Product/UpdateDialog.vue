<template>
  <el-dialog v-model="props.dialogFormVisible" title="修改产品信息" width="500">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确定修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, defineProps, defineEmits } from 'vue'
// 定义接收的 prop 类型
const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
  rowdata:{
    type: Object,
    required: true,
  }
  
});

// 定义自定义事件
const emit = defineEmits(['update:dialogFormVisible']);

// const dialogFormVisible = ref(false)
const formLabelWidth = '120px'

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

// 关闭对话框的方法
function closeDialog() {
console.log(props.rowdata)


  emit('update:dialogFormVisible', false);
}
</script>