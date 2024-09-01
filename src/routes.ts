import axios, { AxiosResponse } from "axios";
import { ToDo } from "./Pages";
const url = "http://localhost:3000";

export const getAll = async (): Promise<AxiosResponse> => await axios.get(`${url}/api/todos`).then(res => {
    return res;
}).catch(err => {
    console.error(err);
    return [] as any;
});

export const getOne = async (id: any) => await axios.get(`${url}/api/todos/${id}`).then(res => {
    return res;
}).catch(err => {
    console.error(err);
    return [] as any;
});

export const Add = async (e: ToDo) => await axios.post(`${url}/api/todos`, e).then(res => {
    return res;
}).catch(err => {
    console.error(err);
    return [] as any;
});

export const RemoveToDo = async ({ id }: { id: any; }) => await axios.delete(`${url}/api/todos`, id);

export const UpdateToDo = async (e: ToDo) => await axios.patch(`${url}/api/todos/${e._id}`, e)