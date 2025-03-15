import React, { useEffect } from "react";
import { Drawer, Button, Form, Input, InputNumber, message, Skeleton } from "antd";
import useCreate from "../hooks/useCreate";
import useUpdate from "../hooks/useUpdate";
import useOne from "../hooks/useOne";

type ProductFormDrawerProps = {
    visible: boolean;
    onClose: () => void;
    productId?: number;
};

const ProductFormDrawer: React.FC<ProductFormDrawerProps> = ({ visible, onClose, productId }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading } = useOne({
        resource: "products",
        id: productId ?? 0,
    });
    const { mutate: createMutate, isPending: isCreatePending } = useCreate({
        resource: "products",
    });
    const { mutate: updateMutate, isPending: isUpdatePending } = useUpdate({
        resource: "products",
        id: productId ?? 0,
    });

    useEffect(() => {
        if (productId && data) {
            form.setFieldsValue(data.data);
        } else {
            form.resetFields();
        }
    }, [productId, data, form]);

    const onSubmit = (formData: any) => {
        if (productId) {
            updateMutate(formData, {
                onSuccess: () => {
                    messageApi.success("Cập nhật sản phẩm thành công");
                    onClose();
                },
                onError: () => messageApi.error("Có lỗi xảy ra"),
            });
        } else {
            createMutate(formData, {
                onSuccess: () => {
                    messageApi.success("Thêm sản phẩm thành công");
                    onClose();
                },
                onError: () => messageApi.error("Có lỗi xảy ra"),
            });
        }
    };

    return (
        <Drawer
            title={productId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            width={720}
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Skeleton loading={isLoading && !!productId} active>
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <Form.Item label="Tên sản phẩm" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Giá sản phẩm" name="price">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Chất liệu" name="material">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isCreatePending || isUpdatePending}
                        >
                            {productId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                        </Button>
                    </Form.Item>
                </Form>
            </Skeleton>
            {contextHolder}
        </Drawer>
    );
};

export default ProductFormDrawer;
