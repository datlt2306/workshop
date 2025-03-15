/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popconfirm, Skeleton, Table } from "antd";
import { Link } from "react-router-dom";
import useList from "../../hooks/useList";

const PostsPage = () => {
    const { data, isLoading, error, isError } = useList({ resource: "posts" });

    const dataSource = data?.data.map((post: any) => ({
        key: post.id,
        ...post,
    }));

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Mô tả",
            dataIndex: "content",
            key: "content",
        },
        {
            dataIndex: "action",
            render: (_: any, item: any) => {
                return (
                    <div className="flex space-x-2">
                        <Button type="primary">
                            <Link to={`/admin/products/edit/${item.id}`}>Sửa</Link>
                        </Button>
                        <Button type="primary" danger>
                            <Popconfirm title="Xóa sản phẩm" onConfirm={() => {}}>
                                Xóa
                            </Popconfirm>
                        </Button>
                    </div>
                );
            },
        },
    ];

    if (isLoading) return <Skeleton active />;
    if (isError) return <div>Error: {error.message}</div>;
    if (!data) return <div>Không có bài viết nào</div>;
    return (
        <div>
            <div className="flex items-center justify-between  mb-3">
                <h2 className="text-xl font-semibold">Bài viết</h2>
                <Button type="primary">
                    <Link to="/admin/products/create">Thêm bài viết</Link>
                </Button>
            </div>

            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};

export default PostsPage;
