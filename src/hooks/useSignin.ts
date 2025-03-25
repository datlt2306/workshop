import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signin } from "../provider/authProvider";


type useSigninParams = {
    resource: string,
}

export const useSignin = ({ resource }: useSigninParams) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (variables: any) => {
            return signin({ resource, variables })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [resource]
            })
        }
    })
}

