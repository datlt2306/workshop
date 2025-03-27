import type React from "react";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Button, Table } from "antd";
import { useState, useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";

export const OrderCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm();
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const { selectProps: customerSelectProps } = useSelect({
        resource: "customers",
        optionLabel: "name",
        optionValue: "id",
    });

    const { data: productsData } = useList({
        resource: "products",
    });

    const products = productsData?.data || [];

    const calculateTotal = (items: any[]) => {
        return items.reduce((sum, item) => {
            const product = products.find((p) => p.id === item.productId);
            const price = product?.price || 0;
            return sum + price * (item.quantity || 0);
        }, 0);
    };

    useEffect(() => {
        const total = calculateTotal(orderItems);
        setTotalAmount(total);

        // Update the form field
        formProps.form?.setFieldsValue({ totalAmount: total });
    }, [orderItems, products]);

    const handleProductChange = (value: any, index: number) => {
        const newItems = [...orderItems];
        newItems[index] = { ...newItems[index], productId: value };
        setOrderItems(newItems);
    };

    const handleQuantityChange = (value: number | null, index: number) => {
        const newItems = [...orderItems];
        newItems[index] = { ...newItems[index], quantity: value || 0 };
        setOrderItems(newItems);
    };

    const addItem = () => {
        setOrderItems([...orderItems, { productId: undefined, quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Customer"
                    name="customerId"
                    rules={[
                        {
                            required: true,
                            message: "Please select a customer",
                        },
                    ]}
                >
                    <Select {...customerSelectProps} />
                </Form.Item>
                <Form.Item
                    label="Order Date"
                    name="orderDate"
                    rules={[
                        {
                            required: true,
                            message: "Please select an order date",
                        },
                    ]}
                    initialValue={new Date()}
                    getValueProps={(value) => ({
                        value: value ? new Date(value) : undefined,
                    })}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: "Please select a status",
                        },
                    ]}
                    initialValue="pending"
                >
                    <Select
                        options={[
                            {
                                label: "Pending",
                                value: "pending",
                            },
                            {
                                label: "Processing",
                                value: "processing",
                            },
                            {
                                label: "Shipped",
                                value: "shipped",
                            },
                            {
                                label: "Delivered",
                                value: "delivered",
                            },
                            {
                                label: "Cancelled",
                                value: "cancelled",
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Order Items">
                    <div style={{ marginBottom: 16 }}>
                        <Table
                            dataSource={orderItems.map((item, index) => ({
                                ...item,
                                key: index,
                                index,
                            }))}
                            pagination={false}
                            size="small"
                        >
                            <Table.Column
                                title="Product"
                                dataIndex="productId"
                                key="productId"
                                render={(value, record: any) => (
                                    <Select
                                        style={{ width: "100%" }}
                                        value={value}
                                        onChange={(val) => handleProductChange(val, record.index)}
                                        options={products.map((p) => ({
                                            label: p.name,
                                            value: p.id,
                                        }))}
                                    />
                                )}
                            />
                            <Table.Column
                                title="Quantity"
                                dataIndex="quantity"
                                key="quantity"
                                render={(value, record: any) => (
                                    <InputNumber
                                        min={1}
                                        value={value}
                                        onChange={(val) => handleQuantityChange(val, record.index)}
                                        style={{ width: "100%" }}
                                    />
                                )}
                            />
                            <Table.Column
                                title="Price"
                                key="price"
                                render={(_, record: any) => {
                                    const product = products.find((p) => p.id === record.productId);
                                    return product ? `$${product.price.toFixed(2)}` : "-";
                                }}
                            />
                            <Table.Column
                                title="Subtotal"
                                key="subtotal"
                                render={(_, record: any) => {
                                    const product = products.find((p) => p.id === record.productId);
                                    const price = product?.price || 0;
                                    return `$${(price * (record.quantity || 0)).toFixed(2)}`;
                                }}
                            />
                            <Table.Column
                                title="Action"
                                key="action"
                                render={(_, record: any) => (
                                    <Button
                                        type="text"
                                        danger
                                        icon={<MinusCircleOutlined />}
                                        onClick={() => removeItem(record.index)}
                                    />
                                )}
                            />
                        </Table>
                        <Button
                            type="dashed"
                            onClick={addItem}
                            style={{ width: "100%", marginTop: 16 }}
                            icon={<PlusOutlined />}
                        >
                            Add Item
                        </Button>
                    </div>
                </Form.Item>

                <Form.Item label="Total Amount" name="totalAmount" initialValue={totalAmount}>
                    <InputNumber
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "100%" }}
                        readOnly
                        value={totalAmount}
                    />
                </Form.Item>

                <Form.Item
                    label="Shipping Address"
                    name="shippingAddress"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a shipping address",
                        },
                    ]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Notes" name="notes">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item name="items" hidden initialValue={orderItems}>
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};
