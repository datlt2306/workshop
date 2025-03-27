import type { AuthProvider } from "@refinedev/core"

const API_URL = "http://localhost:3000"

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 200) {
        const { accessToken, user } = await response.json()
        localStorage.setItem("token", accessToken)
        localStorage.setItem("user", JSON.stringify(user))
        return {
          success: true,
          redirectTo: "/admin",
        }
      }

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Network Error",
        },
      }
    }
  },
  register: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 201) {
        return {
          success: true,
          redirectTo: "/login",
        }
      }

      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Network Error",
        },
      }
    }
  },
  logout: async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return {
      success: true,
      redirectTo: "/login",
    }
  },
  check: async () => {
    const token = localStorage.getItem("token")
    if (token) {
      return {
        authenticated: true,
      }
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    }
  },
  getPermissions: async () => {
    const user = localStorage.getItem("user")
    if (user) {
      const { role } = JSON.parse(user)
      return role
    }
    return null
  },
  getIdentity: async () => {
    const user = localStorage.getItem("user")
    if (user) {
      const parsedUser = JSON.parse(user)
      return parsedUser
    }
    return null
  },
  onError: async (error) => {
    if (error.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return {
        logout: true,
        redirectTo: "/login",
      }
    }

    return { error }
  },
}

export default authProvider

