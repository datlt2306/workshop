/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber, message, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import useOne from "../../hooks/useOne";
import useUpdate from "../../hooks/useUpdate";

const ProductEdit = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isLoading } = useOne({ resource: "products", id: Number(id) });
    console.log(data);
    const { mutate, isPending } = useUpdate({ resource: "products", id: Number(id) });
    const onSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => messageApi.success("Cập nhật sản phẩm thành công"),
            onError: () => messageApi.error("Có lỗi xảy ra"),
        });
    };
    return (
        <div>
            <div className="flex items-center justify-between  mb-3">
                <h2 className="text-xl font-semibold">Thêm Sản phẩm</h2>
            </div>
            <Skeleton loading={isLoading} active avatar>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={onSubmit}
                    initialValues={data?.data}
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
                            {isPending ? <span>Đang tải...</span> : <span>Cập nhật sản phẩm</span>}
                        </Button>
                    </Form.Item>
                </Form>
            </Skeleton>

            {contextHolder}
        </div>
    );
};

export default ProductEdit;
