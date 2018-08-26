import https from 'https';
import axios from 'axios';
const BASE_URL = "api/";
const inst = axios.create({
  baseURL: BASE_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

inst.get("token")
  .then((r) => inst.defaults.headers.post['Csrf-Token'] = r.data.status)
  .catch((e)=> console.log(e) );

export default function instance () {
  return inst;
}

export function BaseUrl () {
  return BASE_URL;
}