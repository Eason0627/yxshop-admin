<template>
  <div class="sale w-full flex flex-col">
    <!-- 销售额折线图 -->
    <div class="sales-trend h-72 bg-gray-100 rounded-lg"></div>
    <!-- 销售额构成饼图 -->
    <div class="sales-composition h-72 bg-gray-100 rounded-lg"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, inject, watch } from "vue";
// 注入 echarts
const echarts = inject<any>("echarts");
// 接收timer
const props = defineProps({
  start: {
    type: String,
  },
  end: {
    type: String,
  },
});

const start = ref(props.start);
const end = ref(props.end);

// 日销售额展示对象
// 1. 根据时刻划分数据 (00:00, 01:00, 02:00, ..., 23:00)
// 2. 将同时段的订单销售额累加

// 周销售额展示对象
// 1. 根据星期数划分数据 (周一, 周二, 周三, ..., 周日)
// 2. 将同星期数的订单销售额累加

// 月销售额展示对象
// 1. 根据天数划分数据 (1, 2, 3, ..., 31)
// 2. 将同一天的订单销售额累加

// 年销售额展示对象
// 1. 根据月份划分数据 (1, 2, 3, ..., 12)
// 2. 将同一个月的订单销售额累加

// const weekOption = ref({});

// // 初始化图表
// const initCharts = () => {
//   const salesTrendChart = echarts.init(document.querySelector(".sales-trend"));
//   const salesCompositionChart = echarts.init(
//     document.querySelector(".sales-composition")
//   );

//   // 1. 销售额折线图
//   // 1.1 日销售额：24小时内的销售额统计
//   // 1.2 周销售额：一星期内的销售额统计
//   // 1.3 月销售额：一个月内的销售额统计
//   // 1.4 年销售额：一年内的销售额统计

//   // 设置图表选项
//   //   salesTrendChart.setOption(trendOption);
//   //   salesCompositionChart.setOption(compositionOption);
// };

// onMounted(() => {
//   // 初始化图表
//   initCharts();
// });
watch([() => props.start, () => props.end], ([newStartVal, newEndVal]) => {
  start.value = newStartVal;
  end.value = newEndVal;
});
</script>
<style lang="scss" scoped>
.marketing-dashboard {
  @apply grid grid-cols-2 gap-4 p-4;
}

.sales-trend,
.sales-composition {
  @apply h-72 bg-gray-100 rounded-lg;
}
</style>
