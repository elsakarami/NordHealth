<template>
  <tr :data-cy="'brewery-row'">
    <TableCell v-for="column in columns" :key="column.key">
      <template v-if="column.key === 'website_url'">
        <BreweryLink :href="brewery[column.key]">Visit</BreweryLink>
      </template>
      <template v-else-if="column.key === 'brewery_type'">
        <BreweryBadge>{{ brewery[column.key] }}</BreweryBadge>
      </template>
      <template v-else>
        {{ brewery[column.key as keyof Brewery] }}
      </template>
    </TableCell>
  </tr>
</template>
<script setup lang="ts">
import TableCell from '@/components/atoms/TableCell.vue'
import BreweryBadge from '@/components/atoms/BreweryBadge.vue'
import BreweryLink from '@/components/atoms/BreweryLink.vue'
import type { columnType,Brewery } from "@/types/index";
const {brewery,columns} = defineProps<{
  brewery: Brewery;
  columns: columnType[];
}>();
</script>