import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocalStorage, useSignin } from "../../hooks";
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
export const SigninPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [_, setToken] = useLocalStorage("access_token", "");

    const navigate = useNavigate();
    const { mutate } = useSignin({ resource: "signin" });

    const onFinish = (formData: any) => {
        mutate(formData, {
            onSuccess: (data) => {
                // navigate("/");
                // messageApi.success("Đăng nhập thành công");

                setToken(data?.data?.accessToken);
            },
            onError: (error: any) => messageApi.error(error?.response?.data),
        });
    };
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Đăng ký</h1>
            </div>
            <Form {...formItemLayout} onFinish={onFinish}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Email Invalid!" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};
export default SigninPage;
