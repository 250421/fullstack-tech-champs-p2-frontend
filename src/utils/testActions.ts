import { axiosInstance } from "@/lib/axios-config"
import axios from "axios";

export async function test() {
    console.log("ABOUT TO TEST BACKED")
  try {

    const res = await axiosInstance.get('http://3.20.227.225:8082/api/users/testing');
    console.log("TESTING DATA: ", res.data);
    
    
    // TODO: Start draft & Redirect

    // return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Request failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}