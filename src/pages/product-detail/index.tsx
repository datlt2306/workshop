import type React from "react";

import { useOne, useList } from "@refinedev/core";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Typography,
    Row,
    Col,
    Card,
    Button,
    Image,
    Descriptions,
    InputNumber,
    Tabs,
    Tag,
    Rate,
    List,
    Avatar,
    Space,
} from "antd";
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);

    const { data: productData, isLoading } = useOne({
        resource: "products",
        id: id || "",
    });

    const product = productData?.data;

    const { data: relatedProductsData } = useList({
        resource: "products",
        filters: [
            {
                field: "categoryId",
                operator: "eq",
                value: product?.categoryId,
            },
            {
                field: "id",
                operator: "ne",
                value: id,
            },
        ],
        pagination: { pageSize: 4 },
    });

    const relatedProducts = relatedProductsData?.data || [];

    const handleAddToCart = () => {
        // In a real app, this would add the product to a cart state or context
        console.log(`Added ${quantity} of ${product?.name} to cart`);

        // Mock implementation to store in localStorage
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = cartItems.findIndex((item: any) => item.id === product?.id);

        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({
                id: product?.id,
                name: product?.name,
                price: product?.price,
                thumbnail: product?.thumbnail,
                quantity: quantity,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));

        // Show notification or feedback
        alert(`Added ${quantity} ${product?.name} to cart!`);
    };

    if (isLoading) {
        return <div style={{ textAlign: "center", padding: "40px 0" }}>Loading...</div>;
    }

    if (!product) {
        return <div style={{ textAlign: "center", padding: "40px 0" }}>Product not found</div>;
    }

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <Image
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.name}
                        style={{ width: "100%", maxHeight: 500, objectFit: "contain" }}
                        fallback="data:image/png;base64,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"
                    />
                </Col>

                <Col xs={24} md={12}>
                    <Card bordered={false}>
                        <Title level={2}>{product.name}</Title>

                        <div style={{ marginBottom: 16 }}>
                            <Rate disabled defaultValue={4.5} allowHalf />
                            <Text style={{ marginLeft: 8 }}>4.5 (24 reviews)</Text>
                        </div>

                        <Title level={3} style={{ color: "#1677ff", marginBottom: 24 }}>
                            ${product.price?.toFixed(2)}
                        </Title>

                        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
                            {product.description}
                        </Paragraph>

                        <Descriptions column={1} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Availability">
                                <Tag
                                    color={
                                        product.status === "in-stock"
                                            ? "success"
                                            : product.status === "low-stock"
                                            ? "warning"
                                            : "error"
                                    }
                                >
                                    {product.status === "in-stock"
                                        ? "In Stock"
                                        : product.status === "low-stock"
                                        ? "Low Stock"
                                        : "Out of Stock"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Category">
                                {product.category?.name}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                            <Text strong style={{ marginRight: 16 }}>
                                Quantity:
                            </Text>
                            <InputNumber
                                min={1}
                                max={product.inventory}
                                value={quantity}
                                onChange={(value) => setQuantity(value || 1)}
                            />
                            <Text type="secondary" style={{ marginLeft: 16 }}>
                                {product.inventory} available
                            </Text>
                        </div>

                        <Space size="middle">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                disabled={product.status === "out-of-stock"}
                            >
                                Add to Cart
                            </Button>
                            <Button size="large" icon={<HeartOutlined />}>
                                Wishlist
                            </Button>
                            <Button size="large" icon={<ShareAltOutlined />}>
                                Share
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 32 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Description" key="1">
                        <div style={{ padding: 16 }}>
                            <Paragraph style={{ fontSize: 16 }}>{product.description}</Paragraph>
                            <Paragraph style={{ fontSize: 16 }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                                auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
                                aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies
                                tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet
                                nisl.
                            </Paragraph>
                        </div>
                    </TabPane>
                    <TabPane tab="Specifications" key="2">
                        <div style={{ padding: 16 }}>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Brand">Brand Name</Descriptions.Item>
                                <Descriptions.Item label="Material">
                                    High Quality Material
                                </Descriptions.Item>
                                <Descriptions.Item label="Weight">0.5 kg</Descriptions.Item>
                                <Descriptions.Item label="Dimensions">
                                    30 x 20 x 10 cm
                                </Descriptions.Item>
                                <Descriptions.Item label="Warranty">12 months</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </TabPane>
                    <TabPane tab="Reviews" key="3">
                        <div style={{ padding: 16 }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    {
                                        author: "John Doe",
                                        avatar: "/placeholder-user.jpg",
                                        content:
                                            "Great product! Exactly as described and arrived quickly.",
                                        rating: 5,
                                        date: "2023-05-15",
                                    },
                                    {
                                        author: "Jane Smith",
                                        avatar: "/placeholder-user.jpg",
                                        content: "Good quality but a bit smaller than I expected.",
                                        rating: 4,
                                        date: "2023-04-22",
                                    },
                                    {
                                        author: "Mike Johnson",
                                        avatar: "/placeholder-user.jpg",
                                        content: "Excellent value for money. Would recommend!",
                                        rating: 5,
                                        date: "2023-03-10",
                                    },
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} />}
                                            title={
                                                <Space>
                                                    <Text strong>{item.author}</Text>
                                                    <Rate disabled defaultValue={item.rating} />
                                                </Space>
                                            }
                                            description={
                                                <>
                                                    <Text>{item.content}</Text>
                                                    <div>
                                                        <Text type="secondary">{item.date}</Text>
                                                    </div>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>

            <div style={{ marginTop: 32 }}>
                <Title level={3}>Related Products</Title>
                <Row gutter={[16, 16]}>
                    {relatedProducts.map((product) => (
                        <Col xs={24} sm={12} md={6} key={product.id}>
                            <Link to={`/products/${product.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <div
                                            style={{
                                                height: 150,
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
                                        description={`$${product.price?.toFixed(2)}`}
                                    />
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};
