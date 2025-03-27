import type React from "react";

import {
    List,
    useTable,
    EditButton,
    ShowButton,
    DeleteButton,
    getDefaultSortOrder,
    FilterDropdown,
    DateField,
} from "@refinedev/antd";
import { useMany } from "@refinedev/core";
import { Table, Space, Tag, DatePicker, Input, Select, Form, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const OrderList: React.FC = () => {
    const { tableProps, sorters, filters } = useTable({
        syncWithLocation: true,
    });

    const { data: customersData, isLoading: customersIsLoading } = useMany({
        resource: "customers",
        ids: tableProps?.dataSource?.map((item) => item.customerId) ?? [],
        queryOptions: {
            enabled: !!tableProps?.dataSource,
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title="Order ID"
                    sorter
                    defaultSortOrder={getDefaultSortOrder("id", sorters)}
                />
                <Table.Column
                    dataIndex="customerId"
                    title="Customer"
                    render={(value) => {
                        if (customersIsLoading) {
                            return "Loading...";
                        }

                        const customer = customersData?.data.find((item) => item.id === value);
                        return customer?.name || "Unknown";
                    }}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                placeholder="Search customer"
                                prefix={<SearchOutlined />}
                                autoFocus
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    dataIndex="orderDate"
                    title="Order Date"
                    render={(value) => <DateField format="YYYY-MM-DD" value={value} />}
                    sorter
                    defaultSortOrder={getDefaultSortOrder("orderDate", sorters)}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Form layout="vertical">
                                <Form.Item label="Order Date">
                                    <DatePicker.RangePicker />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={props.confirm}>
                                        Filter
                                    </Button>
                                </Form.Item>
                            </Form>
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    dataIndex="status"
                    title="Status"
                    render={(value) => {
                        let color = "default";
                        switch (value) {
                            case "pending":
                                color = "orange";
                                break;
                            case "processing":
                                color = "blue";
                                break;
                            case "shipped":
                                color = "cyan";
                                break;
                            case "delivered":
                                color = "green";
                                break;
                            case "cancelled":
                                color = "red";
                                break;
                            default:
                                color = "default";
                        }
                        return <Tag color={color}>{value}</Tag>;
                    }}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{ minWidth: 200 }}
                                mode="multiple"
                                placeholder="Select Status"
                                options={[
                                    { label: "Pending", value: "pending" },
                                    { label: "Processing", value: "processing" },
                                    { label: "Shipped", value: "shipped" },
                                    { label: "Delivered", value: "delivered" },
                                    { label: "Cancelled", value: "cancelled" },
                                ]}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    dataIndex="totalAmount"
                    title="Total"
                    render={(value) => `$${value?.toFixed(2)}`}
                    sorter
                    defaultSortOrder={getDefaultSortOrder("totalAmount", sorters)}
                />
                <Table.Column<any>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};

export { OrderCreate } from "./create";
export { OrderEdit } from "./edit";
export { OrderShow } from "./show";
