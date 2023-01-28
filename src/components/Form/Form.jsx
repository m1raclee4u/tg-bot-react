import React, {useCallback, useEffect, useState} from 'react';
import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [os, setCountry] = useState('all');
    const [maxPrice, setStreet] = useState('');
    const [model, setSubject] = useState('all');
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            os,
            maxPrice,
            model
        }
        tg.sendData(JSON.stringify(data));
    }, [os, maxPrice, model])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Применить фильтры'
        })
    }, [])

    useEffect(() => {
        if(!maxPrice && !os) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [os, maxPrice])

    const onChangeCountry = (e) => {
        setCountry(e.target.value)
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value)
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value)
    }

    return (
        <div className={"form"}>
            <h3>Введите ваши данные</h3>
            <div className="filterInfo">
                <p>Операционная система</p>
                <select value={model} onChange={onChangeCountry} className={'select'}>
                    <option value={'all'}>Все </option>
                    <option value={'apple'}>iOS</option>
                    <option value={'andriod'}>Andriod</option>
                    {/* <option value={'legal'}>Юр. лицо</option> */}
                </select>    
            </div>
            <div className="filterInfo">
                <p>Максимальная цена</p>
                <input
                    className={'input'}
                    type="text"
                    placeholder={'Максимальная цена'}
                    value={maxPrice}
                    onChange={onChangeStreet}
                />
            </div>
            <div className="filterInfo">
                <p>Производитель</p>
                <select value={model} onChange={onChangeSubject} className={'select'}>
                    <option value={'all'}>Все </option>
                    <option value={'apple'}>Apple</option>
                    <option value={'samsung'}>Samsung</option>
                    <option value={'honor'}>Honor</option>
                    <option value={'huawei'}>Huawei</option>
                    <option value={'lenovo'}>Lenovo</option>
                    {/* <option value={'legal'}>Юр. лицо</option> */}
                </select>    
            </div>
            
        </div>
    );
};

export default Form;
