/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { update } from "../provider/dataProvider"

type useCreateProps = {
    resource: string,
    id: number
}

const useUpdate = ({ resource, id }: useCreateProps) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (variables) => update({ resource, variables, id }),
        onSuccess: () => {
            // làm mới lại API
            queryClient.invalidateQueries({
                queryKey: [resource]
            })
        }
    })
}
export default useUpdate;