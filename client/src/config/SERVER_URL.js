//export const SERVER_URL = "https://vclass.up.railway.app"
export const SERVER_URL = process.env.NODE_ENV === "development" ?"http://localhost:5000":"https://vclass.onrender.com"
