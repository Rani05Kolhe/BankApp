

// http request
import axios from "axios";

export const http = (accessToken = null) => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASEURL,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return instance;
};



// ✅ Safe trimData function for React (frontend)
 export const trimData = (obj) => {
  const trimmedObj = {};
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      trimmedObj[key] = value.trim();
    } else {
      trimmedObj[key] = value;
    }
  }
  return trimmedObj;
};




  //fetcher
  export const fetchData = async(api) => {
    try{
      const httpReq = http();

      const {data} = await httpReq.get(api);
      return data;
    }catch(err){
      return null;
    }
  }
