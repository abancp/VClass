import google.generativeai as genai

genai.configure(api_key="AIzaSyCHpSMBQGJJhdCzlmrYPR6MuM-CaVmnekE")
model = genai.GenerativeModel("gemini-1.5-flash")
