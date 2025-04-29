<template>
  <div class="brewery-table-org">
    <FilterBar v-model="filter" :columns="columns" @clear="onClearFilter" />

    <BreweryTable :breweries="paginatedBreweries" :columns="columns" />

    <PaginationControl
      :page="page"
      :per-page="perPage"
      :total="service.filteredData?.value?.length || 0"
      @update:page="handlePageUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BreweryTable from "@/components/molecules/BreweryTable.vue";
import PaginationControl from "@/components/atoms/PaginationControl.vue";
import FilterBar from "@/components/molecules/BreweryFilterbar.vue";
import { BreweryService } from "@/composables/useBreweries.ts";
import type { columnType, Brewery } from "@/types/index";

const service = new BreweryService();
const page = ref<number>(1);
const perPage = ref<number>(20);
const filter = ref({ field: "", term: "" });

const columns: columnType[] = [
  { key: "name", label: "Name" },
  { key: "brewery_type", label: "Type" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "website_url", label: "Website" },
];

async function fetchAllBreweries() {
  await service.fetchBreweries();
}

const paginatedBreweries = computed(() => {
  const start = (page.value - 1) * perPage.value;
  const end = start + perPage.value;
  return service.filteredData.value?.slice(start, end) || [];
});

function handlePageUpdate(newPage: number) {
  const lastPage =
    Math.ceil((service.filteredData.value?.length || 0) / perPage.value) || 1;
  page.value = newPage < 1 ? 1 : newPage > lastPage ? lastPage : newPage;
}

function onClearFilter() {
  filter.value = { field: "", term: "" };
  service.resetFilter();
}

watch(filter, (newFilter) => {
  page.value = 1;
  if (!newFilter.field || !newFilter.term) {
    service.resetFilter();
  } else {
    service.filterDataByField(newFilter.field as keyof Brewery, newFilter.term);
  }
});

onMounted(fetchAllBreweries);
</script>
