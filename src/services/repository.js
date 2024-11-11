import axios from "axios";
export const HTTP = axios.create({
    baseURL:window.VUE_CONFIG_API,
})


export const HTTPImage = axios.create({
    baseURL:window.VUE_CONFIG_API_IMAGE,
})