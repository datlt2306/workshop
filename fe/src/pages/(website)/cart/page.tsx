import { List, Skeleton } from "antd";
import { useCart } from "../../../context/CartContext";
import CartItem from "./_components/CartItem";

const Cart = () => {
    const { cart, isCartLoading } = useCart();

    if (isCartLoading) return <Skeleton active />;

    return (
        <div className="cart">
            <h2>Giỏ Hàng</h2>
            {cart.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={cart}
                    renderItem={(product) => <CartItem key={product.productId} product={product} />}
                />
            )}
            <div className="total">
                Tổng cộng:{" "}
                {cart.reduce((total, product) => total + product.price * product.quantity, 0)} VND
            </div>
        </div>
    );
};

export default Cart;
