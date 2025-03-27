import type React from "react";

import {
    List,
    useTable,
    EditButton,
    ShowButton,
    DeleteButton,
    getDefaultSortOrder,
    FilterDropdown,
    useSelect,
} from "@refinedev/antd";
import { useMany } from "@refinedev/core";
import { Table, Space, Avatar, Tag, Input, Select, Form, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const ProductList: React.FC = () => {
    const { tableProps, sorters, filters, setFilters } = useTable({
        syncWithLocation: true,
    });

    const { data: categoriesData, isLoading: categoriesIsLoading } = useMany({
        resource: "categories",
        ids: tableProps?.dataSource?.map((item) => item.categoryId) ?? [],
        queryOptions: {
            enabled: !!tableProps?.dataSource,
        },
    });

    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
        optionLabel: "name",
        optionValue: "id",
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title="ID"
                    sorter
                    defaultSortOrder={getDefaultSortOrder("id", sorters)}
                />
                <Table.Column
                    dataIndex="thumbnail"
                    title="Thumbnail"
                    render={(value) => (
                        <Avatar
                            shape="square"
                            src={value}
                            size={48}
                            style={{ backgroundColor: "#f0f0f0" }}
                        />
                    )}
                />
                <Table.Column
                    dataIndex="name"
                    title="Name"
                    sorter
                    defaultSortOrder={getDefaultSortOrder("name", sorters)}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                placeholder="Search name"
                                prefix={<SearchOutlined />}
                                autoFocus
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    dataIndex="price"
                    title="Price"
                    sorter
                    render={(value) => `$${value.toFixed(2)}`}
                    defaultSortOrder={getDefaultSortOrder("price", sorters)}
                />
                <Table.Column
                    dataIndex="inventory"
                    title="Inventory"
                    sorter
                    defaultSortOrder={getDefaultSortOrder("inventory", sorters)}
                />
                <Table.Column
                    dataIndex="categoryId"
                    title="Category"
                    render={(value) => {
                        if (categoriesIsLoading) {
                            return "Loading...";
                        }

                        const category = categoriesData?.data.find((item) => item.id === value);
                        return category?.name || "Unknown";
                    }}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Form layout="vertical">
                                <Form.Item label="Category">
                                    <Select
                                        style={{ minWidth: 200 }}
                                        placeholder="Select Category"
                                        {...categorySelectProps}
                                        allowClear
                                        mode="multiple"
                                    />
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
                            case "in-stock":
                                color = "success";
                                break;
                            case "low-stock":
                                color = "warning";
                                break;
                            case "out-of-stock":
                                color = "error";
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
                                    { label: "In Stock", value: "in-stock" },
                                    { label: "Low Stock", value: "low-stock" },
                                    { label: "Out of Stock", value: "out-of-stock" },
                                ]}
                            />
                        </FilterDropdown>
                    )}
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

export { ProductCreate } from "./create";
export { ProductEdit } from "./edit";
export { ProductShow } from "./show";
