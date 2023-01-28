import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Realme', price: 5000, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '2', title: 'Redmi 10', price: 12000, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '3', title: 'Honor 10i', price: 5000, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '4', title: 'iPhone 8 Plus', price: 122, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '5', title: 'Huawei P40 lite', price: 5000, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '6', title: 'Honor 10 lite', price: 600, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '7', title: 'iPhone XR', price: 5500, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
    {id: '8', title: 'Huawei P30 Pro', price: 12000, description: '8x2.2 ГГц, 4 ГБ, 2 SIM, IPS, 2340x1080, камера 48+5 Мп, 3G, 4G, GPS, 4000 мАч'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('https://webapptelegram.hopto.org:8443/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
