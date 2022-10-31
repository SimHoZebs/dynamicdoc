import axios from "axios";

export default async function test() {
  return await axios.get<String>("http://localhost:3000/api/test");
}