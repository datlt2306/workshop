import type React from "react";

import { useGetIdentity, useLogout } from "@refinedev/core";
import { Layout, Dropdown, Avatar, Button, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined, ShopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

export const Header: React.FC = () => {
    const { data: user } = useGetIdentity<{ name: string; email: string; avatar?: string }>();
    const { mutate: logout } = useLogout();

    const items = [
        {
            key: "1",
            label: (
                <Link to="/admin">
                    <DashboardOutlined /> Dashboard
                </Link>
            ),
        },
        {
            key: "2",
            label: (
                <Link to="/">
                    <ShopOutlined /> View Shop
                </Link>
            ),
        },
        {
            key: "3",
            label: (
                <Button type="text" icon={<LogoutOutlined />} onClick={() => logout()} danger>
                    Logout
                </Button>
            ),
        },
    ];

    return (
        <AntdHeader
            style={{
                background: "#fff",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
            }}
        >
            <Space>
                {user?.name && <Text strong>{user.name}</Text>}
                <Dropdown menu={{ items }} placement="bottomRight">
                    <Avatar
                        src={user?.avatar}
                        icon={<UserOutlined />}
                        style={{ cursor: "pointer" }}
                    />
                </Dropdown>
            </Space>
        </AntdHeader>
    );
};
