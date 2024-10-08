import { Button, InputNumber, List } from "antd";
import { useCart } from "../../../../context/CartContext";

const CartItem = ({ product }: { product: any }) => {
    const { updateItemMutation, removeItemMutation } = useCart();

    const increaseQuantity = () => {
        updateItemMutation.mutate({ ...product, quantity: product.quantity + 1 });
    };

    const decreaseQuantity = () => {
        if (product.quantity > 1) {
            updateItemMutation.mutate({ ...product, quantity: product.quantity - 1 });
        }
    };

    const removeFromCart = () => {
        removeItemMutation.mutate(product.productId);
    };

    return (
        <List.Item
            actions={[
                <Button onClick={decreaseQuantity}>-</Button>,
                <InputNumber min={1} value={product.quantity} readOnly />,
                <Button onClick={increaseQuantity}>+</Button>,
                <Button onClick={removeFromCart} type="primary" danger>
                    Remove
                </Button>,
            ]}
        >
            <List.Item.Meta
                avatar={<img src={product.imageUrl} alt={product.name} width={50} />}
                title={product.name}
                description={`${product.price} VND`}
            />
        </List.Item>
    );
};

export default CartItem;
