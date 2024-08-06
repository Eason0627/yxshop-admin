<template>
  <div class="marketing">
    <!-- 时间范围切换按钮 -->
    <TimeRange @getTime="getTime"></TimeRange>
    <div class="marketing-dashboard">
      <div class="left grid grid-cols-1 gap-4">
        <Sale :start :end />
      </div>
      <div class="center grid grid-cols-1 gap-4">
        <!-- 订单全国分布图 -->
        <div class="order-distribution h-72 bg-gray-100 rounded-lg"></div>
        <!-- 订单量折线图 -->
        <div class="order-trend h-72 bg-gray-100 rounded-lg"></div>
        <!-- 热销商品条形图 -->
        <div class="hot-goods h-72 bg-gray-100 rounded-lg"></div>
      </div>
      <div class="right grid grid-cols-1 gap-4">
        <!-- 客户评价饼图 -->
        <div class="customer-evaluation h-72 bg-gray-100 rounded-lg"></div>
        <!-- 用户画像饼图 -->
        <div class="user-portrait h-72 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeRange from "./TimeRange.vue";
import Sale from "./Left/Sale.vue";
import { ref, inject, onMounted } from "vue";

const echarts = inject<any>("echarts");
const start = ref("");
const end = ref("");
// 初始化图表
const initCharts = () => {
  const salesTrendChart = echarts.init(document.querySelector(".sales-trend"));
  const salesCompositionChart = echarts.init(
    document.querySelector(".sales-composition")
  );
  const orderDistributionChart = echarts.init(
    document.querySelector(".order-distribution")
  );
  const orderTrendChart = echarts.init(document.querySelector(".order-trend"));
  const hotGoodsChart = echarts.init(document.querySelector(".hot-goods"));
  const customerEvaluationChart = echarts.init(
    document.querySelector(".customer-evaluation")
  );
  const userPortraitChart = echarts.init(
    document.querySelector(".user-portrait")
  );

  // 设置图表配置
  const option = {
    title: {
      text: "Sample Chart",
    },
    tooltip: {},
    legend: {
      data: ["Sample"],
    },
    xAxis: {
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    yAxis: {},
    series: [
      {
        name: "Sample",
        type: "line",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
    ],
  };

  // 设置图表选项
  salesTrendChart.setOption(option);
  salesCompositionChart.setOption(option);
  orderDistributionChart.setOption(option);
  orderTrendChart.setOption(option);
  hotGoodsChart.setOption(option);
  customerEvaluationChart.setOption(option);
  userPortraitChart.setOption(option);
};

const getTime = (startTime: string, endTime: string): void => {
  start.value = startTime;
  end.value = endTime;
};

onMounted(() => {
  // 初始化图表
  initCharts();
});
</script>

<style lang="scss" scoped>
.marketing-dashboard {
  @apply grid grid-cols-3 gap-4 p-4;
}
</style>
