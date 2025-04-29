<template>
  <div
    class="pagination-control">
      <provet-button size="s" :disabled="page <= 1" @click="previousPage">
        Previous
      </provet-button>
      <div>
      <span>Page {{ page }} of {{ totalPages }}</span>
    </div>
      <provet-button data-cy="pagination-next" size="s" :disabled="page >= totalPages" @click="nextPage">
        Next
      </provet-button>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  perPage: number
}>()

const emit = defineEmits<{
  (e: 'update:page', newPage: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const previousPage = () => {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
  }
}

const nextPage = () => {
  if (props.page < totalPages.value) {
    emit('update:page', props.page + 1)
  }
}
</script>
