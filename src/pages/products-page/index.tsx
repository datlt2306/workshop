"use client";

import type React from "react";

import { useList } from "@refinedev/core";
import { useState, useEffect } from "react";
import {
    Typography,
    Row,
    Col,
    Card,
    Button,
    Input,
    Select,
    Checkbox,
    Slider,
    Space,
    Empty,
    Pagination,
    Tag,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import queryString from "query-string";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const ProductsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = queryString.parse(location.search);

    const [filters, setFilters] = useState({
        q: (queryParams.q as string) || "",
        categories: queryParams.categories
            ? Array.isArray(queryParams.categories)
                ? queryParams.categories
                : [queryParams.categories]
            : [],
        priceRange: [
            queryParams.minPrice ? Number(queryParams.minPrice) : 0,
            queryParams.maxPrice ? Number(queryParams.maxPrice) : 1000,
        ],
        sort: (queryParams.sort as string) || "newest",
    });

    const [currentPage, setCurrentPage] = useState(queryParams.page ? Number(queryParams.page) : 1);
    const pageSize = 12;

    const { data: categoriesData } = useList({
        resource: "categories",
    });

    const { data: productsData, isLoading } = useList({
        resource: "products",
        filters: [
            {
                field: "name",
                operator: "contains",
                value: filters.q,
            },
            ...(filters.categories.length > 0
                ? [
                      {
                          field: "categoryId",
                          operator: "in",
                          value: filters.categories,
                      },
                  ]
                : []),
            {
                field: "price",
                operator: "gte",
                value: filters.priceRange[0],
            },
            {
                field: "price",
                operator: "lte",
                value: filters.priceRange[1],
            },
        ],
        sorters: [
            {
                field:
                    filters.sort === "price_asc"
                        ? "price"
                        : filters.sort === "price_desc"
                        ? "price"
                        : "id",
                order:
                    filters.sort === "price_desc"
                        ? "desc"
                        : filters.sort === "price_asc"
                        ? "asc"
                        : "desc",
            },
        ],
        pagination: {
            current: currentPage,
            pageSize,
        },
    });

    useEffect(() => {
        const newQueryParams = {
            ...(filters.q && { q: filters.q }),
            ...(filters.categories.length > 0 && { categories: filters.categories }),
            ...(filters.priceRange[0] > 0 && { minPrice: filters.priceRange[0].toString() }),
            ...(filters.priceRange[1] < 1000 && { maxPrice: filters.priceRange[1].toString() }),
            ...(filters.sort !== "newest" && { sort: filters.sort }),
            ...(currentPage > 1 && { page: currentPage.toString() }),
        };

        navigate({
            pathname: location.pathname,
            search: queryString.stringify(newQueryParams),
        });
    }, [filters, currentPage]);

    const handleSearch = (value: string) => {
        setFilters({ ...filters, q: value });
        setCurrentPage(1);
    };

    const handleCategoryChange = (categoryIds: string[]) => {
        setFilters({ ...filters, categories: categoryIds });
        setCurrentPage(1);
    };

    const handlePriceChange = (value: [number, number]) => {
        setFilters({ ...filters, priceRange: value });
        setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        setFilters({ ...filters, sort: value });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
            <Title level={2}>Products</Title>

            <Row gutter={[24, 24]}>
                {/* Filters Sidebar */}
                <Col xs={24} md={6}>
                    <Card title="Filters" bordered={false}>
                        <Space direction="vertical" style={{ width: "100%" }} size="large">
                            <div>
                                <Text strong>Search</Text>
                                <Search
                                    placeholder="Search products"
                                    value={filters.q}
                                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                                    onSearch={handleSearch}
                                    style={{ marginTop: 8 }}
                                />
                            </div>

                            <div>
                                <Text strong>Categories</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Checkbox.Group
                                        value={filters.categories}
                                        onChange={handleCategoryChange}
                                        style={{ display: "flex", flexDirection: "column", gap: 8 }}
                                    >
                                        {categoriesData?.data.map((category) => (
                                            <Checkbox key={category.id} value={category.id}>
                                                {category.name}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </div>
                            </div>

                            <div>
                                <Text strong>Price Range</Text>
                                <Slider
                                    range
                                    min={0}
                                    max={1000}
                                    value={filters.priceRange}
                                    onChange={handlePriceChange}
                                    style={{ marginTop: 16 }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: 8,
                                    }}
                                >
                                    <Text>${filters.priceRange[0]}</Text>
                                    <Text>${filters.priceRange[1]}</Text>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    setFilters({
                                        q: "",
                                        categories: [],
                                        priceRange: [0, 1000],
                                        sort: "newest",
                                    });
                                    setCurrentPage(1);
                                }}
                                style={{ marginTop: 8 }}
                            >
                                Reset Filters
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* Products Grid */}
                <Col xs={24} md={18}>
                    <div
                        style={{
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text>
                            Showing {productsData?.data.length || 0} of {productsData?.total || 0}{" "}
                            products
                        </Text>
                        <Select
                            value={filters.sort}
                            onChange={handleSortChange}
                            style={{ width: 200 }}
                        >
                            <Option value="newest">Newest</Option>
                            <Option value="price_asc">Price: Low to High</Option>
                            <Option value="price_desc">Price: High to Low</Option>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading...</div>
                    ) : productsData?.data.length === 0 ? (
                        <Empty description="No products found" />
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {productsData?.data.map((product) => (
                                    <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
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
                                                            src={
                                                                product.thumbnail ||
                                                                "/placeholder.svg"
                                                            }
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
                                                            <Text strong>
                                                                ${product.price?.toFixed(2)}
                                                            </Text>
                                                            {product.status && (
                                                                <Tag
                                                                    color={
                                                                        product.status ===
                                                                        "in-stock"
                                                                            ? "success"
                                                                            : product.status ===
                                                                              "low-stock"
                                                                            ? "warning"
                                                                            : "error"
                                                                    }
                                                                >
                                                                    {product.status}
                                                                </Tag>
                                                            )}
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

                            <div style={{ marginTop: 24, textAlign: "center" }}>
                                <Pagination
                                    current={currentPage}
                                    total={productsData?.total || 0}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};
