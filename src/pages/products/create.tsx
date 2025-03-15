/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber, message } from "antd";
import useCreate from "../../hooks/useCreate";

const ProductAdd = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { mutate, isPending } = useCreate({ resource: "products" });
    const onSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => messageApi.success("Thêm sản phẩm thành công"),
            onError: () => messageApi.error("Có lỗi xảy ra"),
        });
    };
    return (
        <div>
            <div className="flex items-center justify-between  mb-3">
                <h2 className="text-xl font-semibold">Thêm Sản phẩm</h2>
            </div>

            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onSubmit}
            >
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
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        {isPending ? <span>Đang tải...</span> : <span>Thêm sản phẩm</span>}
                    </Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default ProductAdd;
