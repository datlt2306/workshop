import type React from "react";
import { useShow, useOne, useMany } from "@refinedev/core";
import { Show, DateField } from "@refinedev/antd";
import { Descriptions, Table, Card, Space, Typography, Tag } from "antd";

const { Title, Text } = Typography;

export const OrderShow: React.FC = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const { data: customerData, isLoading: customerIsLoading } = useOne({
        resource: "customers",
        id: record?.customerId || "",
        queryOptions: {
            enabled: !!record?.customerId,
        },
    });

    const { data: productsData, isLoading: productsIsLoading } = useMany({
        resource: "products",
        ids: record?.items?.map((item: any) => item.productId) || [],
        queryOptions: {
            enabled: !!record?.items,
        },
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "orange";
            case "processing":
                return "blue";
            case "shipped":
                return "cyan";
            case "delivered":
                return "green";
            case "cancelled":
                return "red";
            default:
                return "default";
        }
    };

    return (
        <Show isLoading={isLoading}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Card>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                Order #{record?.id}
                            </Title>
                            <Text type="secondary">
                                <DateField format="YYYY-MM-DD HH:mm" value={record?.orderDate} />
                            </Text>
                        </div>
                        <Tag
                            color={getStatusColor(record?.status)}
                            style={{ fontSize: 14, padding: "4px 8px" }}
                        >
                            {record?.status}
                        </Tag>
                    </div>

                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Customer">
                            {customerIsLoading ? "Loading..." : customerData?.data?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {customerIsLoading ? "Loading..." : customerData?.data?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Shipping Address">
                            {record?.shippingAddress}
                        </Descriptions.Item>
                        <Descriptions.Item label="Order Date">
                            <DateField format="YYYY-MM-DD" value={record?.orderDate} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Amount">
                            ${record?.totalAmount?.toFixed(2)}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Order Items">
                    <Table dataSource={record?.items} rowKey="productId" pagination={false}>
                        <Table.Column
                            title="Product"
                            dataIndex="productId"
                            render={(value) => {
                                if (productsIsLoading) {
                                    return "Loading...";
                                }
                                const product = productsData?.data.find(
                                    (item) => item.id === value
                                );
                                return product?.name || "Unknown";
                            }}
                        />
                        <Table.Column title="Quantity" dataIndex="quantity" />
                        <Table.Column
                            title="Price"
                            dataIndex="productId"
                            render={(value) => {
                                if (productsIsLoading) {
                                    return "Loading...";
                                }
                                const product = productsData?.data.find(
                                    (item) => item.id === value
                                );
                                return product ? `$${product.price.toFixed(2)}` : "-";
                            }}
                        />
                        <Table.Column
                            title="Subtotal"
                            render={(_, record: any) => {
                                if (productsIsLoading) {
                                    return "Loading...";
                                }
                                const product = productsData?.data.find(
                                    (item) => item.id === record.productId
                                );
                                const price = product?.price || 0;
                                return `$${(price * record.quantity).toFixed(2)}`;
                            }}
                        />
                    </Table>
                </Card>

                {record?.notes && (
                    <Card title="Notes">
                        <Text>{record.notes}</Text>
                    </Card>
                )}
            </Space>
        </Show>
    );
};
