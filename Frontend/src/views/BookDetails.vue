<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import Card from 'primevue/card';
import axios from '../axios';

interface BookModel {
  _id: string;
  title: string;
  genre: string;
  author: string;
  description: string;
}

const route = useRoute();
const router = useRouter();
const book = ref<BookModel | null>(null);
const loading = ref(true);
const error = ref('');

const fetchBookDetails = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/books/${route.params.id}`);
    book.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch book details';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};

onBeforeMount(() => {
  fetchBookDetails();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="px-6 lg:px-12 xl:px-14 2xl:px-16 bg-[#020202] shadow-md text-white">
      <div class="flex my-1.5 text-[#C4C4C4]">
        <div class="flex flex-auto items-center gap-2">
          <img src="https://primefaces.org/cdn/primevue/images/usercard.png" alt="Company Logo"
            class="h-10 w-auto xl:h-12">
          <span class="text-xl font-bold ms-2">BookExchangeSystem</span>
        </div>
        <div class="flex items-center justify-end">
          <slot name="navItems" class="flex justify-end">
            <RouterLink to="/logout" class="mx-2 hover:text-gray-300">Logout</RouterLink>
          </slot>
        </div>
      </div>
    </header>
    <main class="flex-grow bg-gray-100 p-6">
      <div class="max-w-4xl mx-auto">
        <button @click="goBack" class="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
          <i class="pi pi-angle-left" style="font-size: 1.5rem"></i>
          <span>Back to Books</span>
        </button>

        <div v-if="loading" class="flex justify-center items-center h-64">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
        </div>

        <div v-else-if="error" class="flex justify-center items-center h-64 text-red-500">
          {{ error }}
        </div>

        <div v-else-if="book" class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex gap-6">
            <div class="w-1/3">
              <img src="https://primefaces.org/cdn/primevue/images/usercard.png" alt="Book cover"
                class="w-full rounded-lg shadow">
            </div>
            <div class="w-2/3">
              <h1 class="text-3xl font-bold mb-4">{{ book.title }}</h1>
              <div class="space-y-4">
                <div>
                  <h2 class="text-lg font-semibold text-gray-700">Author</h2>
                  <p>{{ book.author }}</p>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-700">Genre</h2>
                  <p>{{ book.genre }}</p>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-700">Description</h2>
                  <p class="text-gray-600">{{ book.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>