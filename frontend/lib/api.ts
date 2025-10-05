import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DRUPAL_BASE,
  headers: {
    Accept: "application/vnd.api+json",
  },
  withCredentials: false,
});
