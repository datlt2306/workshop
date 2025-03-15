import React from "react";

type Props = {
    children: React.ReactNode;
    fallback: React.ReactNode;
};

const Authenticated = ({ children, fallback }: Props) => {
    const isAuthenticated = true;
    return <>{isAuthenticated ? children : fallback}</>;
};

export default Authenticated;
