/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { create } from "../provider/dataProvider"

type useCreateProps = {
    resource: string,
}

const useCreate = ({ resource }: useCreateProps) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (variables) => create({ resource, variables }),
        onSuccess: () => {
            // làm mới lại API
            queryClient.invalidateQueries({
                queryKey: [resource]
            })
        }
    })
}
export default useCreate;