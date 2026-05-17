//////////////////////////////////////////////////////////
// 🌍 BASE URL (KONG ONLY)
//////////////////////////////////////////////////////////

const BASE_URL = "http://localhost:8000"

//////////////////////////////////////////////////////////
// 🔐 TOKEN HELPERS
//////////////////////////////////////////////////////////

const getAccessToken = () => localStorage.getItem("accessToken")
const getRefreshToken = () => localStorage.getItem("refreshToken")
const getUserId = () => localStorage.getItem("userId")

const saveTokens = (data: any) => {
  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("refreshToken", data.token)
  localStorage.setItem("userId", String(data.userId))
}

const clearTokens = () => {
  localStorage.clear()
}

//////////////////////////////////////////////////////////
// 🔁 REFRESH TOKEN
//////////////////////////////////////////////////////////

const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/v1/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: getRefreshToken(),
      }),
    })

    if (!res.ok) throw new Error("Refresh failed")

    const data = await res.json()
    saveTokens(data)
    return data.accessToken
  } catch (err) {
    console.error("❌ Refresh failed → logout")
    clearTokens()
    window.location.href = "/login"
    return null
  }
}

//////////////////////////////////////////////////////////
// 🌐 MAIN REQUEST HANDLER
//////////////////////////////////////////////////////////

const request = async (url: string, options: RequestInit = {}) => {
  try {
    let token = getAccessToken()
    let userId = getUserId()

    const isGet = options.method === "GET" || !options.method

    let res = await fetch(`${BASE_URL}${url}`, {
      method: options.method || "GET",
      headers: {
        ...(isGet ? {} : { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(userId && { "x-user-id": userId }),
        ...(options.headers || {}),
      },
      ...(isGet ? {} : { body: options.body }),
    })

    //////////////////////////////////////////////////
    // 🔄 TOKEN REFRESH
    //////////////////////////////////////////////////
    if (res.status === 401) {
      console.log("🔄 Token expired → refreshing...")

      const newToken = await refreshAccessToken()
      if (!newToken) return

      res = await fetch(`${BASE_URL}${url}`, {
        method: options.method || "GET",
        headers: {
          ...(isGet ? {} : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${newToken}`,
          ...(userId && { "x-user-id": userId }),
          ...(options.headers || {}),
        },
        ...(isGet ? {} : { body: options.body }),
      })
    }

    //////////////////////////////////////////////////
    // 📦 RESPONSE PARSE
    //////////////////////////////////////////////////
    const text = await res.text()

    let data
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = text
    }

    if (!res.ok) {
      console.error("❌ API Error:", data)
      throw new Error(data?.message || "Request failed")
    }

    return data
  } catch (err) {
    console.error("❌ Network Error:", err)
    throw err
  }
}

//////////////////////////////////////////////////////////
// 🔐 AUTH APIs
//////////////////////////////////////////////////////////

export const login = async (payload: {
  username: string
  password: string
}) => {
  const data = await request("/auth/v1/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  console.log("Login response:", data)

 if (!data.accessToken) {
  throw new Error("Login failed")
}

  saveTokens(data)
  return data
}

export const signup = async (payload: any) => {
  const data = await request("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (!data.accessToken) {
  throw new Error("Login failed")
}

  saveTokens(data)
  return data
}

//////////////////////////////////////////////////////////
// 👤 USER APIs (FIXED)
//////////////////////////////////////////////////////////

export const getUserProfile = async (userId: string) => {
  console.log("Fetching user with ID:", userId)

  if (!userId || userId === "undefined" || userId === "null") {
    throw new Error("Invalid userId")
  }

  return request(`/user/v1/getUser?userId=${userId}`, {
    method: "GET",
  })
}

//////////////////////////////////////////////////////////
// 💰 EXPENSE APIs
//////////////////////////////////////////////////////////

export const getExpenses = async () => {
  return request("/expense/v1/getExpense")
}

export const addExpense = async (expense: {
  amount: number
  note?: string
  category?: string
}) => {
  return request("/expense/v1/addExpense", {
    method: "POST",
    body: JSON.stringify({
      amount: expense.amount,
      merchant: expense.note || expense.category || "General",
      currency: "inr",
    }),
  })
}

export const deleteExpense = async (id: string) => {
  return request(`/expense/v1/delete/${id}`, {
    method: "DELETE",
  })
}

//////////////////////////////////////////////////////////
// 🤖 DS SERVICE (AI → KAFKA)
//////////////////////////////////////////////////////////

export const sendMessageToDS = async (message: string) => {
  return request("/v1/ds/message", {
    method: "POST",
    body: JSON.stringify({ message }),
  })
}

//////////////////////////////////////////////////////////
// 📊 INSIGHTS APIs
//////////////////////////////////////////////////////////

export const getInsights = async (payload: {
  expenses: any[]
  monthlySpend: number
  budget: number
}) => {
  return request("/insight/v1/getInsights", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}