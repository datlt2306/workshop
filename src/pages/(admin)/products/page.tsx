/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { Image, Skeleton, Table, TableProps } from "antd";

interface DataType {
    key: string;
    name: string;
    price: number;
    in_stock: boolean;
    image: string;
    description: string;
}

const AdminProductsPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/products`);
            const data = await response.json();
            return data.map((product: any) => ({
                key: product.key,
                ...product,
            }));
        },
    });

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (image) => <Image src={image} width={50} />,
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Tình trạng",
            dataIndex: "in_stock",
            key: "in_stock",
            render: (in_stock) => <div>{in_stock ? "Còn hàng" : "Hết hàng"}</div>,
        },
        {
            title: "Mô tả",
            key: "description",
            dataIndex: "description",
        },
        {
            key: "action",
        },
    ];
    return (
        <>
            <Skeleton loading={isLoading} active>
                <Table columns={columns} dataSource={data} />
            </Skeleton>
        </>
    );
};

export default AdminProductsPage;
