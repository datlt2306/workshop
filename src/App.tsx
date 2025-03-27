import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
    ErrorComponent,
    notificationProvider,
    ThemedLayoutV2,
    ThemedSiderV2,
    ThemedTitleV2,
} from "@refinedev/antd";
import dataProvider from "@refinedev/simple-rest";
import authProvider from "./authProvider";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ConfigProvider, App as AntdApp, theme } from "antd";
import "@refinedev/antd/dist/reset.css";

import { ProductList, ProductCreate, ProductEdit, ProductShow } from "./pages/products";
import { CategoryList, CategoryCreate, CategoryEdit } from "./pages/categories";
import { OrderList, OrderCreate, OrderEdit, OrderShow } from "./pages/orders";
import { Home } from "./pages/home";
import { ProductsPage } from "./pages/products-page";
import { ProductDetail } from "./pages/product-detail";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Header } from "./components/header";
import { ShopLayout } from "./components/layouts/shop-layout";
import { Dashboard } from "./pages/dashboard";
import routerBindings, {
    DocumentTitleHandler,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";

const API_URL = "http://localhost:3000";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ConfigProvider
                    theme={{
                        algorithm: theme.defaultAlgorithm,
                        token: {
                            colorPrimary: "#1677ff",
                        },
                    }}
                >
                    <AntdApp>
                        <Refine
                            routerProvider={routerBindings}
                            dataProvider={dataProvider(API_URL)}
                            authProvider={authProvider}
                            notificationProvider={notificationProvider}
                            resources={[
                                {
                                    name: "products",
                                    list: "/admin/products",
                                    create: "/admin/products/create",
                                    edit: "/admin/products/edit/:id",
                                    show: "/admin/products/show/:id",
                                    meta: {
                                        canDelete: true,
                                    },
                                },
                                {
                                    name: "categories",
                                    list: "/admin/categories",
                                    create: "/admin/categories/create",
                                    edit: "/admin/categories/edit/:id",
                                    meta: {
                                        canDelete: true,
                                    },
                                },
                                {
                                    name: "orders",
                                    list: "/admin/orders",
                                    create: "/admin/orders/create",
                                    edit: "/admin/orders/edit/:id",
                                    show: "/admin/orders/show/:id",
                                    meta: {
                                        canDelete: true,
                                    },
                                },
                            ]}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                            }}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <ThemedLayoutV2
                                            Header={Header}
                                            Sider={ThemedSiderV2}
                                            Title={({ collapsed }) => (
                                                <ThemedTitleV2
                                                    collapsed={collapsed}
                                                    text="Product Admin"
                                                />
                                            )}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    }
                                >
                                    <Route path="admin">
                                        <Route index element={<Dashboard />} />
                                        <Route path="products">
                                            <Route index element={<ProductList />} />
                                            <Route path="create" element={<ProductCreate />} />
                                            <Route path="edit/:id" element={<ProductEdit />} />
                                            <Route path="show/:id" element={<ProductShow />} />
                                        </Route>
                                        <Route path="categories">
                                            <Route index element={<CategoryList />} />
                                            <Route path="create" element={<CategoryCreate />} />
                                            <Route path="edit/:id" element={<CategoryEdit />} />
                                        </Route>
                                        <Route path="orders">
                                            <Route index element={<OrderList />} />
                                            <Route path="create" element={<OrderCreate />} />
                                            <Route path="edit/:id" element={<OrderEdit />} />
                                            <Route path="show/:id" element={<OrderShow />} />
                                        </Route>
                                    </Route>
                                </Route>

                                <Route element={<ShopLayout />}>
                                    <Route index element={<Home />} />
                                    <Route path="/products" element={<ProductsPage />} />
                                    <Route path="/products/:id" element={<ProductDetail />} />
                                </Route>

                                <Route
                                    element={
                                        <ThemedLayoutV2
                                            Header={() => <></>}
                                            Sider={() => <></>}
                                            Title={() => <></>}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    }
                                >
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="*" element={<ErrorComponent />} />
                                </Route>
                            </Routes>
                            <RefineKbar />
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                        </Refine>
                    </AntdApp>
                </ConfigProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
