import { defineStore } from 'pinia'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData
    },
    clearUser() {
      this.user = null
    }
  }
}) 