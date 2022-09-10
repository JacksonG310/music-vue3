import axios, { AxiosResponse } from "axios";
const ERR_OK = 0;
const baseURL = process.env.NODE_ENV === 'production' ? 'http://43.158.207.152:8080/' : '/';


axios.defaults.baseURL = baseURL;

export function get(url: string, params?: any) {
    return axios.get(url, {
        params
    }).then((res: AxiosResponse) => {
        const serverData = res.data;
        if (serverData.code === ERR_OK) {
            return serverData.result;
        }
    }).catch((e) => {
        console.log(e);
    })
}