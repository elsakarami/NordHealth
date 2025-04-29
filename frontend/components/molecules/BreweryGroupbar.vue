<template>
  <provet-stack direction="horizontal" justify-content="left">
    <provet-dropdown data-cy="groupby-field" size="s">
      <provet-button slot="toggle">
        {{ selectedLabel || "Select group by field" }}
      </provet-button>

      <provet-dropdown-item
        v-for="col in columns"
        :key="col.key"
        :data-cy="`groupby-field-option-${col.key}`"
        @click="onSelect(col)"
      >
        {{ col.label }}
      </provet-dropdown-item>
    </provet-dropdown>
  </provet-stack>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import type { columnType } from "@/types/index";

const {columns} = defineProps<{
  modelValue: string;
  columns: columnType[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selectedField = ref("");
const selectedLabel = ref("");

function onSelect(col: { key: string; label: string }) {
  selectedField.value = col.key;
  selectedLabel.value = col.label;
}

watch(selectedField, (newField) => {
  emit("update:modelValue", newField);
});
</script>
