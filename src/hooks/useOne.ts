
import { useQuery } from "@tanstack/react-query";
import { getOne } from "../provider/dataProvider";

type useListProps = {
    resource: string;
    id: number;
}

const useOne = ({ resource, id }: useListProps) => {
    return useQuery({
        queryKey: [resource, id],
        queryFn: () => getOne({ resource, id }),
        enabled: !!id
    })
}
export default useOne;
