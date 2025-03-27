import type React from "react"
import { useList } from "@refinedev/core"
import { Row, Col, Card, Statistic, Typography, List, Avatar, Space } from "antd"
import {
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"

const { Title, Text } = Typography

export const Dashboard: React.FC = () => {
  const { data: productsData } = useList({
    resource: "products",
    pagination: { pageSize: 5 },
  })

  const { data: ordersData } = useList({
    resource: "orders",
    pagination: { pageSize: 5 },
  })

  const { data: categoriesData } = useList({
    resource: "categories",
  })

  const totalProducts = productsData?.total || 0
  const totalOrders = ordersData?.total || 0
  const totalCategories = categoriesData?.total || 0

  // Mock revenue data
  const totalRevenue = 12580
  const revenueIncrease = 15.8

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/products">View all products</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/orders">View all orders</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Categories"
              value={totalCategories}
              prefix={<TagsOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
            <div style={{ marginTop: 8 }}>
              <Link to="/admin/categories">View all categories</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix={
                <Space>
                  <Text type="success">
                    <RiseOutlined /> {revenueIncrease}%
                  </Text>
                </Space>
              }
              precision={2}
              valueStyle={{ color: "#722ed1" }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Compared to last month</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Recent Orders" bordered={false} extra={<Link to="/admin/orders">View All</Link>}>
            <List
              dataSource={ordersData?.data || []}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Link key="view" to={`/admin/orders/show/${item.id}`}>
                      View
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Link to={`/admin/orders/show/${item.id}`}>Order #{item.id}</Link>}
                    description={`${item.customer?.name || "Customer"} - ${new Date(item.orderDate).toLocaleDateString()}`}
                  />
                  <div>${item.totalAmount?.toFixed(2)}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recent Products" bordered={false} extra={<Link to="/admin/products">View All</Link>}>
            <List
              dataSource={productsData?.data || []}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Link key="view" to={`/admin/products/show/${item.id}`}>
                      View
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.thumbnail} shape="square" style={{ backgroundColor: "#f0f0f0" }} />}
                    title={<Link to={`/admin/products/show/${item.id}`}>{item.name}</Link>}
                    description={`${item.category?.name || "Uncategorized"} - ${item.inventory} in stock`}
                  />
                  <div>${item.price?.toFixed(2)}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

