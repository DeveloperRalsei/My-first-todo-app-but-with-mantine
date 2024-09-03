import axios, { AxiosResponse } from "axios";
import { ToDo } from "./Pages";
export const url = "https://my-first-todo-app-but-with-mantine.onrender.com";

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

export const AddToDo = async (e: ToDo) => await axios.post(`${url}/api/todos`, e).then(res => {
    return res;
}).catch(err => {
    console.error(err);
    return [] as any;
});

export const RemoveToDo = async (id: any) => await axios.delete(`${url}/api/todos/${id}`).then(res => {
    return res
}).catch(error => {
    console.error(error)
    return error
})

export const RemoveAllToDo = async () => await axios.delete(`${url}/api/todos`);

export const UpdateToDo = async (e: ToDo) => await axios.patch(`${url}/api/todos/${e._id}`, e)