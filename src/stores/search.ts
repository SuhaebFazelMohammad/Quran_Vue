import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface SearchContext {
  placeholder?: string;
  emptyText?: string;
}

export const useSearchStore = defineStore("search", () => {
  const query = ref("");
  const context = ref<SearchContext>({});

  const placeholder = computed(() => context.value.placeholder ?? "Search...");
  const emptyText = computed(
    () => context.value.emptyText ?? "Try searching for something"
  );

  function setQuery(value: string) {
    query.value = value;
  }

  function clearQuery() {
    query.value = "";
  }

  function setContext(ctx: SearchContext) {
    context.value = { ...ctx };
  }

  function resetContext() {
    context.value = {};
  }

  return {
    query,
    placeholder,
    emptyText,
    setQuery,
    clearQuery,
    setContext,
    resetContext,
  };
});
