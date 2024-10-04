export interface IProduct {
    attributes: { [key: string]: any }[];
    quantity: number;
    reviews: number;
    tags: string[];
    status: boolean;
    _id: string;
    name: string;
    price: number;
    stock: boolean;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}