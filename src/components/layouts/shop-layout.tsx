import type React from "react";

import { Layout, Menu, Input, Badge, Button, Drawer, Space } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    ShoppingCartOutlined,
    UserOutlined,
    MenuOutlined,
    HomeOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import { Footer } from "../footer";

const { Header, Content } = Layout;
const { Search } = Input;

export const ShopLayout: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    // Mock cart count - in a real app, this would come from a cart state or context
    useEffect(() => {
        const cart = localStorage.getItem("cart");
        if (cart) {
            try {
                const parsedCart = JSON.parse(cart);
                setCartCount(parsedCart.length);
            } catch (e) {
                setCartCount(0);
            }
        }
    }, []);

    const menuItems = [
        {
            key: "/",
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: "/products",
            icon: <AppstoreOutlined />,
            label: <Link to="/products">Products</Link>,
        },
        {
            key: "/cart",
            icon: <ShoppingOutlined />,
            label: <Link to="/cart">Cart</Link>,
        },
        {
            key: "/login",
            icon: <LoginOutlined />,
            label: <Link to="/login">Login</Link>,
        },
    ];

    return (
        <Layout className="layout" style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        maxWidth: 1200,
                        margin: "0 auto",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setVisible(true)}
                            style={{ display: "none", marginRight: 16 }}
                            className="mobile-menu-button"
                        />
                        <Link
                            to="/"
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                marginRight: 40,
                                color: "#1677ff",
                            }}
                        >
                            ProductStore
                        </Link>
                        <div className="desktop-menu" style={{ display: "flex" }}>
                            <Menu
                                mode="horizontal"
                                selectedKeys={[current]}
                                items={menuItems}
                                style={{ border: "none" }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Search
                            placeholder="Search products"
                            style={{ width: 200, marginRight: 16 }}
                            className="search-input"
                        />
                        <Space>
                            <Link to="/cart">
                                <Badge count={cartCount} size="small">
                                    <Button
                                        type="text"
                                        icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                                    />
                                </Badge>
                            </Link>
                            <Link to="/login">
                                <Button
                                    type="text"
                                    icon={<UserOutlined style={{ fontSize: 20 }} />}
                                />
                            </Link>
                        </Space>
                    </div>
                </div>
            </Header>

            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setVisible(false)}
                open={visible}
                width={250}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[current]}
                    items={menuItems}
                    onClick={() => setVisible(false)}
                />
            </Drawer>

            <Content style={{ padding: "0 0 40px", background: "#f5f5f5" }}>
                <Outlet />
            </Content>

            <Footer />

            <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
          .search-input {
            width: 150px !important;
          }
        }
      `}</style>
        </Layout>
    );
};
