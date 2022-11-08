import axios from "axios";

const req = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL + "/api"
});

export default req;