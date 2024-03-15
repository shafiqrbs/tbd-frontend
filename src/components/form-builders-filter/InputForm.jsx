import React from "react";
import {
    Tooltip,
    TextInput
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {IconInfoCircle, IconSearch, IconX} from "@tabler/icons-react";
import {getHotkeyHandler} from "@mantine/hooks";
import {setCustomerFilterData, setUserFilterData, setVendorFilterData} from "../../store/core/crudSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {setProductFilterData} from "../../store/inventory/crudSlice.js";

function InputForm(props) {

    const {label, placeholder, nextField, id,name,module} = props

    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)
    const userFilterData = useSelector((state) => state.crudSlice.userFilterData)
    const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData)

    return (
        <>
            {
                <TextInput
                    label={label}
                    leftSection={<IconSearch size={16} opacity={0.5}/>}
                    size="sm"
                    placeholder={placeholder}
                    autoComplete="off"
                    onKeyDown={getHotkeyHandler([
                        nextField === 'submit' ?
                        ['Enter', (e) => {
                            document.getElementById(nextField).click();
                        }]
                            :
                        ['Enter', (e) => {
                            document.getElementById(nextField).focus();
                        }]
                        ,
                    ])}
                    onChange={(e) => {
                        if(module==='customer'){dispatch(setCustomerFilterData({...customerFilterData, [name]: e.currentTarget.value}))}
                        if(module==='vendor'){dispatch(setVendorFilterData({...vendorFilterData, [name]: e.currentTarget.value}))}
                        if(module==='user'){dispatch(setUserFilterData({...userFilterData, [name]: e.currentTarget.value}))}
                        if(module==='product'){dispatch(setProductFilterData({...productFilterData, [name]: e.currentTarget.value}))}
                    }}
                    value={
                        module === 'customer' ? customerFilterData[name] :
                        module === 'vendor' ? vendorFilterData[name] :
                        module === 'user' ? userFilterData[name] :
                        module === 'product' ? productFilterData[name] :
                        ''
                    }
                    id={id}
                    rightSection={
                        (module === 'customer' && customerFilterData[name]) ||
                        (module === 'user' && userFilterData[name]) ||
                        (module === 'product' && productFilterData[name]) ||
                        (module === 'vendor' && vendorFilterData[name]) ? (
                            <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                                <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                    if (module === 'customer') {
                                        dispatch(setCustomerFilterData({
                                            ...customerFilterData,
                                            [name]: ''
                                        }));
                                    } else if (module === 'vendor') {
                                        dispatch(setVendorFilterData({
                                            ...vendorFilterData,
                                            [name]: ''
                                        }));
                                    }else if (module === 'user') {
                                        dispatch(setUserFilterData({
                                            ...userFilterData,
                                            [name]: ''
                                        }));
                                    }else if (module === 'product') {
                                        dispatch(setProductFilterData({
                                            ...productFilterData,
                                            [name]: ''
                                        }));
                                    }
                                }}/>
                            </Tooltip>
                        ) : (
                            <Tooltip label={placeholder} withArrow position={"bottom"} c={'indigo'} bg={`indigo.1`}>
                                <IconInfoCircle size={16} opacity={0.5}/>
                            </Tooltip>
                        )
                    }
                />
            }
        </>
    );
}

export default InputForm;
