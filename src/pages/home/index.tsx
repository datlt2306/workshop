import type React from "react";
import { useList } from "@refinedev/core";
import { Typography, Row, Col, Card, Button, List, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export const Home: React.FC = () => {
    const { data: featuredProducts } = useList({
        resource: "products",
        filters: [
            {
                field: "featured",
                operator: "eq",
                value: true,
            },
        ],
        pagination: { pageSize: 4 },
    });

    const { data: categories } = useList({
        resource: "categories",
        pagination: { pageSize: 6 },
    });

    const { data: newArrivals } = useList({
        resource: "products",
        sorters: [
            {
                field: "id",
                order: "desc",
            },
        ],
        pagination: { pageSize: 8 },
    });

    return (
        <div>
            {/* Hero Section */}
            <div
                style={{
                    background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                    padding: "60px 20px",
                    color: "white",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Title level={1} style={{ color: "white", marginBottom: 16 }}>
                        Welcome to ProductStore
                    </Title>
                    <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: "0 auto 24px" }}>
                        Discover our wide range of high-quality products at competitive prices
                    </Paragraph>
                    <Link to="/products">
                        <Button type="primary" size="large" ghost>
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Featured Products */}
            <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <Title level={2}>Featured Products</Title>
                    <Link to="/products">
                        <Button type="link">
                            View All <RightOutlined />
                        </Button>
                    </Link>
                </div>

                <Row gutter={[24, 24]}>
                    {featuredProducts?.data.map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            <Link to={`/products/${product.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <div
                                            style={{
                                                height: 200,
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#f5f5f5",
                                            }}
                                        >
                                            <img
                                                alt={product.name}
                                                src={product.thumbnail || "/placeholder.svg"}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        title={product.name}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">
                                                    {product.category?.name}
                                                </Text>
                                                <Text strong>${product.price?.toFixed(2)}</Text>
                                            </Space>
                                        }
                                    />
                                    <div style={{ marginTop: 16 }}>
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            block
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Categories */}
            <div style={{ background: "#f5f5f5", padding: "40px 20px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
                        Shop by Category
                    </Title>

                    <Row gutter={[16, 16]}>
                        {categories?.data.map((category) => (
                            <Col xs={12} sm={8} md={4} key={category.id}>
                                <Link to={`/products?category=${category.id}`}>
                                    <Card
                                        hoverable
                                        style={{ textAlign: "center" }}
                                        bodyStyle={{ padding: "12px" }}
                                    >
                                        <div style={{ fontSize: 16, fontWeight: "bold" }}>
                                            {category.name}
                                        </div>
                                        <div>
                                            <Tag color="blue">
                                                {category.productCount || 0} products
                                            </Tag>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* New Arrivals */}
            <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
                <Title level={2} style={{ marginBottom: 24 }}>
                    New Arrivals
                </Title>

                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={newArrivals?.data || []}
                    renderItem={(product) => (
                        <List.Item>
                            <Link to={`/products/${product.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <div
                                            style={{
                                                height: 180,
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#f5f5f5",
                                            }}
                                        >
                                            <img
                                                alt={product.name}
                                                src={product.thumbnail || "/placeholder.svg"}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        title={product.name}
                                        description={
                                            <div>
                                                <Text type="secondary">
                                                    {product.category?.name}
                                                </Text>
                                                <div>
                                                    <Text strong>${product.price?.toFixed(2)}</Text>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Link>
                        </List.Item>
                    )}
                />
            </div>

            {/* Promotional Banner */}
            <div
                style={{
                    background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                    padding: "40px 20px",
                    margin: "40px 0",
                    color: "white",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Title level={2} style={{ color: "white", marginBottom: 16 }}>
                        Special Offer
                    </Title>
                    <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: "0 auto 24px" }}>
                        Get 20% off on all products with code: SPECIAL20
                    </Paragraph>
                    <Link to="/products">
                        <Button
                            type="primary"
                            size="large"
                            style={{ background: "white", color: "#389e0d", borderColor: "white" }}
                        >
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
