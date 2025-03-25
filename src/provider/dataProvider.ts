import axios from "axios"
import { config } from "../api/axios"


type getListParams = {
    resource: string
}
type getOneParams = {
    resource: string,
    id: number
}
type deleteParams = {
    resource: string,
    id: number
}
type createOneParams = {
    resource: string,
    variables: any
}
type updateParams = {
    resource: string,
    variables: any,
    id: number
}
// services => call api => GET|POST|PUT|DELETE
const dataProvider = {
    getList: async ({ resource }: getListParams) => {
        const response = await config.get(`/${resource}`);
        return {
            data: response.data,
            total: response.data.length
        }
    },
    getOne: async ({ resource, id }: getOneParams) => {
        const response = await config.get(`/${resource}/${id}`);
        return {
            data: response.data
        }
    },
    createOne: async ({ resource, variables }: createOneParams) => {
        const response = await config.post(`/${resource}`, variables, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('access_token') || ''}`
            }
        });
        return {
            data: response.data
        }
    },
    deleteOne: async ({ resource, id }: deleteParams) => {
        const response = await config.delete(`/${resource}/${id}`);
        return {
            success: true
        }
    },
    updateOne: async ({ resource, id, variables }: updateParams) => {
        const response = await config.put(`/${resource}/${id}`, variables);
        return {
            data: response.data
        }
    },
}

export const { getList, createOne, deleteOne, updateOne, getOne } = dataProvider;
