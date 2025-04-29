<template>
  <div>
    <BreweryGroupbar v-model="groupByField" :columns="columns" />
    <h1>
      Breweries Grouped by{{ groupByField }}
    </h1>
    <div v-if="groupedData">
      <h2 >Grouped Results:</h2>
      <VChart
        v-if="groupedData && Object.keys(groupedData).length > 0"
        :option="chartOptions"
        class="echart-container"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import BreweryGroupbar from "@/components/molecules/BreweryGroupbar.vue";
import { BreweryService } from "@/composables/useBreweries";
import type { columnType } from "@/types/index";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from "echarts/components";

use([SVGRenderer, BarChart, TooltipComponent, GridComponent, DatasetComponent]);

const groupByField = ref("");
const groupedData = ref<Record<string, number> | null>(null);

const service = new BreweryService();

const columns: columnType[] = [
  { key: "brewery_type", label: "Type" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
];

watch(groupByField, async (newField) => {
  if (!newField) {
    groupedData.value = null;
    return;
  }
  try {
    const data = await service.fetchGroupedBreweries(
      newField as keyof (typeof columns)[number]
    );
    groupedData.value = data ?? null;
  } catch (error) {
    console.error("Failed to fetch grouped data:", error);
  }
});

const chartOptions = computed<ECOption>(() => {
  if (!groupedData.value || Object.keys(groupedData.value).length === 0) {
    return {
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value" },
      series: [],
    };
  }

  return {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: Object.keys(groupedData.value) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: Object.values(groupedData.value),
      },
    ],
  };
});
</script>
