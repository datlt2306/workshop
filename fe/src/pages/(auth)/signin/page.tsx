import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useLocalStorage } from "../../../hooks/useStorage";

type FieldType = {
    email: string;
    password?: string;
    confirmPassword?: string;
};

const SigninPage = () => {
    const [, setUser] = useLocalStorage("user", { user: "", token: "" });
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const { mutate } = useMutation({
        mutationFn: async (formData: FieldType) => {
            const response = await axios.post("http://localhost:3000/api/signin", formData);
            return response.data;
        },
        onSuccess: (data) => {
            setUser(data);
            messageApi.success("Signin success!");
        },
        onError: (error: any) => {
            console.log(error);
            messageApi.error(error?.response.data.message || "Signin failed");
        },
    });

    const onFinish = (values: FieldType) => {
        mutate(values);
    };

    return (
        <>
            {contextHolder}
            <Form
                name="signin"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Invalid email!" },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default SigninPage;
