import { Button, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCreate, useOne } from "../../hooks";

const ProductDetail = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useOne({ resource: "products", id: Number(id) });
    const { mutate } = useCreate({ resource: "carts" });
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(data?.data?.quantity);
    }, [data]);

    const onHandleChange = (value: any) => {
        setQuantity(value);
    };

    const onAddToCart = () => {
        mutate({ productId: id, quantity });
    };
    const render = (product: any) => {
        return (
            <>
                <h1>{product?.name}</h1>
                <p>{product?.description}</p>
                <p>{product?.price}</p>
                <InputNumber onChange={onHandleChange} defaultValue={data?.data?.quantity} />
                <Button onClick={onAddToCart}>Add to cart</Button>
            </>
        );
    };
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error?.response?.data}</div>;

    return (
        <div>
            {quantity}
            {render(data?.data)}
        </div>
    );
};

export default ProductDetail;
