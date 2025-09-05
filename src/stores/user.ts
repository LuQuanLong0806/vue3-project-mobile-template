import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  
  // 方法
  function login(userData: User) {
    user.value = userData
    isLoggedIn.value = true
    // 这里可以添加token存储逻辑
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  function logout() {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('user')
  }
  
  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }
  
  // 初始化时检查本地存储
  function initializeUser() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        user.value = userData
        isLoggedIn.value = true
      } catch (error) {
        console.error('解析用户数据失败:', error)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    updateUser,
    initializeUser
  }
})
