import { useQuery } from "@tanstack/react-query";
import { getList, getOne } from "../provider/dataProvider";


type useOneParams = {
    resource: string,
    id: number
}

export const useOne = ({ resource, id }: useOneParams) => {
    return useQuery({
        queryKey: [resource, id],
        queryFn: () => getOne({ resource, id }),
    });

}
