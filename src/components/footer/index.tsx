import type React from "react"
import { Layout, Typography, Row, Col, Space, Divider } from "antd"
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons"

const { Footer: AntdFooter } = Layout
const { Title, Text, Link } = Typography

export const Footer: React.FC = () => {
  return (
    <AntdFooter style={{ background: "#001529", padding: "40px 0", color: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#fff" }}>
              About Us
            </Title>
            <Text style={{ color: "#ccc" }}>
              We provide high-quality products at competitive prices. Our mission is to deliver exceptional customer
              service and satisfaction.
            </Text>
            <Space style={{ marginTop: 16 }}>
              <Link href="https://facebook.com" target="_blank">
                <FacebookOutlined style={{ fontSize: 24, color: "#fff" }} />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <TwitterOutlined style={{ fontSize: 24, color: "#fff" }} />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <InstagramOutlined style={{ fontSize: 24, color: "#fff" }} />
              </Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#fff" }}>
              Quick Links
            </Title>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <Link href="/" style={{ color: "#ccc" }}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link href="/products" style={{ color: "#ccc" }}>
                  Products
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link href="/about" style={{ color: "#ccc" }}>
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <Link href="/contact" style={{ color: "#ccc" }}>
                  Contact
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#fff" }}>
              Contact Us
            </Title>
            <Space direction="vertical">
              <Space>
                <HomeOutlined />
                <Text style={{ color: "#ccc" }}>123 Street, City, Country</Text>
              </Space>
              <Space>
                <PhoneOutlined />
                <Text style={{ color: "#ccc" }}>+1 234 567 8900</Text>
              </Space>
              <Space>
                <MailOutlined />
                <Text style={{ color: "#ccc" }}>info@example.com</Text>
              </Space>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <Text style={{ color: "#ccc", display: "block", textAlign: "center" }}>
          © {new Date().getFullYear()} Product Management. All rights reserved.
        </Text>
      </div>
    </AntdFooter>
  )
}

