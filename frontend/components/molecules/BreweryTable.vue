<template>
  <provet-table data-cy="brewery-table">
    <table>
      <thead>
        <tr>
          <TableHeadCell v-for="column in columns" :key="column.key">
            {{ column.label }}
          </TableHeadCell>
        </tr>
      </thead>
      <tbody >
        <BreweryTableRow
          v-for="brewery in breweries"
          :key="brewery.id"
          :brewery="brewery"
          :columns="columns"
        />
      </tbody>
    </table>
  </provet-table>
</template>

<script setup lang="ts">
import TableHeadCell from '@/components/atoms/TableHeadCell.vue';
import BreweryTableRow from '@/components/molecules/BreweryTableRow.vue';
import type { columnType,Brewery } from "@/types/index";
const {breweries,columns} = defineProps<{
  breweries: Brewery[];
  columns: columnType[];
}>();

</script>