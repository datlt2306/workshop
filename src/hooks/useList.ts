import { useQuery } from "@tanstack/react-query";
import { getList } from "../provider/dataProvider";

type useListProps = {
    resource: string;
}

const useList = ({ resource }: useListProps) => {
    return useQuery({
        queryKey: [resource],
        queryFn: () => getList({ resource }),
    })
}
export default useList;
