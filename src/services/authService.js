import { createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../statics/baseUrl";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  return data;
});
