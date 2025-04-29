<template>
  <provet-stack direction="horizontal" justify-content="left">
    <div class="brewery-filter">
      <provet-dropdown data-cy="filter-field" size="s">
        <provet-button slot="toggle">
          {{ selectedLabel || "Select filter type" }}
        </provet-button>
  
        <provet-dropdown-item
          v-for="col in columns"
          :key="col.key"
          :data-cy="`filter-field-option-${col.key}`"
          @click="onSelect(col)"
        >
          {{ col.label }}
        </provet-dropdown-item>
      </provet-dropdown>
      <provet-input
        :value="searchTerm"
        type="search"
        data-cy="filter-input"
        size="m"
        :placeholder="
          selectedField
            ? `Search by ${columns.find((c) => c.key === selectedField)?.label}`
            : 'Search...'
        "
        hide-label
        @input="(e) => (searchTerm = e.target.value)"
      />
  
      <provet-button
        v-if="selectedField && searchTerm"
        type="button"
        data-cy="clear-filter"
        @click="onClear"
      >
        Clear
      </provet-button>

    </div>
  </provet-stack>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import type { columnType } from "@/types/index";

const props = defineProps<{
  modelValue: {
    field: string;
    term: string;
  };
  columns: columnType[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: { field: string; term: string }): void;
  (e: "clear"): void;
}>();

const selectedField = ref("");
const selectedLabel = ref("");
function onSelect(col: { key: string; label: string }) {
  selectedField.value = col.key;
  selectedLabel.value = col.label;
}

const searchTerm = ref(props.modelValue.term);

watch([selectedField, searchTerm], () => {
  emit("update:modelValue", {
    field: selectedField.value,
    term: searchTerm.value,
  });
});

function onClear() {
  selectedField.value = "";
  searchTerm.value = "";
  emit("clear");
}
</script>
