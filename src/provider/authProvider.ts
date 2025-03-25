import { config } from "../api/axios";


type signupParams = {
    resource: string,
    variables: any,
}
type signinParams = {
    resource: string,
    variables: any,
}
const dataProvider = {
    signup: async ({ resource, variables }: signupParams) => {
        const response = await config.post(`/${resource}`, variables);
        return {
            data: response.data
        }
    },
    signin: async ({ resource, variables }: signinParams) => {
        const response = await config.post(`/${resource}`, variables);
        return {
            data: response.data
        }
    },
}

export const { signup, signin } = dataProvider;
