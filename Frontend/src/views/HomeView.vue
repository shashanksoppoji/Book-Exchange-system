<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from 'vue';
import Card from 'primevue/card'
import axios from '../axios'
import TabMenu from 'primevue/tabmenu';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'

interface UserBook {
  bookId: string;
  condition: string;
  status: string;
  _id: string;
}

interface BookModel {
  _id: string;
  title: string;
  genre: string;
  author: string;
  description: string;
  userId: string;
}

const searchQuery = ref('')
const tabItems = ref([{ label: 'All Books', icon: 'pi pi-list' }, { label: 'My Listing', icon: 'pi pi-users' }])
const detailsId = ref(0)
const isRightPanelOpen = ref(false)
const isSubmitting = ref(false)

const allBooks = ref<BookModel[]>([])
const router = useRouter();
const userStore = useUserStore()

const detailsNav = ((book: BookModel) => {
  router.push(`/book/${book._id}`);
})

const userBooks = computed(() => {
  if (!userStore.user || !allBooks.value) return [];

  return allBooks.value.filter(book =>
    userStore.user!._id === book.userId
  ).map(book => ({
    ...book }));
});

const searchResults = ref<BookModel[]>([]);
const isSearching = ref(false);

watch(searchQuery, (newValue) => {
  if (!newValue.trim()) {
    // If search query is empty, show all books
    isSearching.value = false;
    searchResults.value = [];
    return;
  }

  const searchTerm = newValue.toLowerCase().trim();
  const booksToSearch = active.value === 0 ? allBooks.value : userBooks.value;

  searchResults.value = booksToSearch.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.genre.toLowerCase().includes(searchTerm)
  );

  isSearching.value = true;
});

const filteredList = computed(() => {
  if (isSearching.value) {
    return searchResults.value;
  }
  return active.value === 0 ? allBooks.value : userBooks.value;
});

const fetchBooks = async () => {
  try {
    const response = await axios.get("/api/books");
    allBooks.value = response.data;
  } catch (error) {
    console.error('Failed to fetch books:', error);
  }
}
onBeforeMount(async () => {
  await fetchBooks();
});

const active = ref(0);

const closeRightPanel = () => {
  isRightPanelOpen.value = false
  isSubmitting.value = false
}

const newBook = ref({
  title: '',
  genre: '',
  author: '',
  description: ''
})

const addNewBook = async () => {
  try {
    if (!userStore.user?._id) {
      console.error('User not authenticated');
      return;
    }

    isSubmitting.value = true;
    await axios.post("/api/books/create", {
      ...newBook.value,
      userId: userStore.user._id
    });

    // Reset the form
    newBook.value = {
      title: '',
      genre: '',
      author: '',
      description: ''
    };

    closeRightPanel();
  } catch (error) {
    console.error('Failed to add book:', error);
  } finally {
    await fetchBooks();
    isSubmitting.value = false;
  }
}

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="px-6 lg:px-12 xl:px-14 2xl:px-16 bg-[#020202] shadow-md text-white">
      <div class="flex my-1.5 text-[#C4C4C4] ">
        <div class="flex flex-auto items-center gap-2">
          <img src="https://primefaces.org/cdn/primevue/images/usercard.png" alt="Company Logo"
            class="h-10 w-auto xl:h-12">
          <span class="text-xl font-bold ms-2">BookExchangeSystem</span>
        </div>
        <div class="flex items-center justify-end ">
          <slot name="navItems" class="flex justify-end">
            <RouterLink to="/logout" class="mx-2 hover:text-gray-300">Logout</RouterLink>
            <!-- <span class="mx-2 hover:text-gray-300" @click="logout()">Logout</span> -->
            <!-- <i class="pi pi-user mr-16 ms-16 hover:text-gray-300" style="font-size: 1.5rem" @click="toggle"></i> -->
          </slot>
        </div>
      </div>
    </header>
    <main class="flex-grow bg-gray-100" v-if="detailsId !== 0">
      <div class="flex flex-wrap overflow-x-auto">
        <div class="flex flex-col px-12 pt-12 pb-0 space-y-6">
          <i class="pi pi-angle-left" style="font-size: 2.5rem"></i>
        </div>
      </div>
    </main>
    <main class="flex-grow bg-gray-100" v-else>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold ms-6">Book's List</h1>
        <div class="flex items-center p-6">

          <span class="flex items-center gap-2">
            <div class="flex-1">
              <input v-model="searchQuery" type="text" placeholder="Search for books"
                class="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button v-if="active === 1"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="isRightPanelOpen = true">
              + Add Books
            </button>
          </span>
        </div>
      </div>
      <div class="card">
        <TabMenu v-model:activeIndex="active" :model="tabItems" class="bg-transparent" />
      </div>
      <div class="flex flex-wrap overflow-x-auto">
        <!-- Show message when no search results -->
        <div v-if="isSearching && searchResults.length === 0" class="w-full text-center mt-4 text-gray-600">
          No books found matching your search.
        </div>
        <!-- Show message when no books in current tab -->
        <div v-else-if="filteredList.length === 0" class="w-full text-center mt-4 text-gray-600">
          {{ active === 0 ? 'No books available.' : 'You haven\'t added any books yet.' }}
        </div>
        <!-- Show books if available -->
        <div v-else v-for="item in filteredList" class="w-1/4 p-2">
          <Card style="width: 100%; height: 400px; overflow: hidden" class="m-0" @click="() => detailsNav(item)">
            <template #header>
              <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" 
                   class="w-full h-48 object-cover" />
            </template>
            <template #title>
              <div class="truncate">{{ item.title }}</div>
            </template>
            <template #subtitle>
              <div v-if="active === 1">
                <p class="truncate">Condition: {{ (item as any).condition }}</p>
                <p class="truncate">Status: {{ (item as any).status }}</p>
              </div>
              <p v-else class="truncate">{{ item.author }}</p>
            </template>
            <template #content>
              <p class="m-0 line-clamp-3">{{ item.description }}</p>
            </template>
          </Card>
        </div>
      </div>
      <!-- Right side panel -->
      <div v-if="isRightPanelOpen"
        class="fixed inset-y-0 right-0 w-1/3 bg-white shadow-lg p-4 overflow-y-auto mt-4 z-10">
        <div class="flex justify-end mb-4">
          <i class="pi pi-times" style="font-size: 1.5rem" @click="closeRightPanel"></i>
        </div>
        <h2 class="text-xl font-semibold mb-4">Add New Book
        </h2>
        <form @submit.prevent="addNewBook()" class="space-y-4">
          <div>
            <label class="block mb-1">Title</label>
            <input v-model="newBook.title"
              class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label class="block mb-1">Genre</label>
            <input v-model="newBook.genre" type="text"
              class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label class="block mb-1">Author</label>
            <input v-model="newBook.author" type="text"
              class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label class="block mb-1">Description</label>
            <input v-model="newBook.description" type="text"
              class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeRightPanel"
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Add
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>