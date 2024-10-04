import { useQuery } from "@tanstack/react-query";
import { Image, Skeleton, Table } from "antd";
import type { TableProps } from "antd/es/table";
import { IProduct } from "../../../interfaces/product";
import axios from "axios";

interface DataType {
    key: string;
    imageUrl: string;
    name: string;
    price: number;
    stock: boolean;
    description: string;
}

const AdminProductsPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/products`);
            console.log(response);
            return response.data.products.map((product: IProduct) => ({
                key: product._id,
                ...product,
            }));
        },
    });
    const columns: TableProps<DataType>["columns"] = [
        {
            title: "Ảnh",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (imageUrl) => <Image src={imageUrl} width={50} />,
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
            dataIndex: "stock",
            key: "stock",
            render: (stock) => <div>{stock ? "Còn hàng" : "Hết hàng"}</div>,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
    ];
    if (isLoading) return <Skeleton active />;
    console.log(data);
    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default AdminProductsPage;
