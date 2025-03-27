import type React from "react";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Upload, Button, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export const ProductEdit: React.FC = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const productData = queryResult?.data?.data;

    useEffect(() => {
        if (productData?.thumbnail) {
            setImageUrl(productData.thumbnail);
        }
    }, [productData]);

    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: productData?.categoryId,
    });

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // Mock image upload - in a real app, this would upload to a server
    const handleImageChange = (info: any) => {
        if (info.file.status === "done") {
            // Get this url from response in real world
            setImageUrl(URL.createObjectURL(info.file.originFileObj));
        }
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a product name",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a description",
                        },
                    ]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a price",
                        },
                        {
                            type: "number",
                            min: 0,
                            message: "Price must be greater than or equal to 0",
                        },
                    ]}
                >
                    <InputNumber
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "100%" }}
                    />
                </Form.Item>
                <Form.Item
                    label="Inventory"
                    name="inventory"
                    rules={[
                        {
                            required: true,
                            message: "Please enter inventory amount",
                        },
                        {
                            type: "number",
                            min: 0,
                            message: "Inventory must be greater than or equal to 0",
                        },
                    ]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: "Please select a category",
                        },
                    ]}
                >
                    <Select {...categorySelectProps} />
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
                >
                    <Select
                        options={[
                            {
                                label: "In Stock",
                                value: "in-stock",
                            },
                            {
                                label: "Low Stock",
                                value: "low-stock",
                            },
                            {
                                label: "Out of Stock",
                                value: "out-of-stock",
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Featured" name="featured" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item
                    name="thumbnail"
                    label="Thumbnail"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="thumbnail"
                        listType="picture-card"
                        showUploadList={true}
                        beforeUpload={(file) => {
                            // Return false to prevent actual upload
                            return false;
                        }}
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Edit>
    );
};
