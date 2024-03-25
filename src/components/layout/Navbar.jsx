import React  from 'react'
import {  NavLink } from '@mantine/core';
import {
    IconGauge,
} from '@tabler/icons-react';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
function Navbar() {
    const navigate = useNavigate()
    const {t, i18n} = useTranslation();

    return (
        <>
            <NavLink
                href="#required-for-focus"
                label={t('Core')}
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                childrenOffset={28}
            >
                <NavLink
                    href="customer"
                    label={t('Customer')}
                    component="button"
                    onClick={(e)=>{navigate('core/customer')}}
                />
                <NavLink
                    href="user"
                    label={t('Users')}
                    component="button"
                    onClick={(e)=>{navigate('core/user')}}
                />
                <NavLink
                    href="user"
                    label={t('Vendors')}
                    component="button"
                    onClick={(e)=>{navigate('core/vendor')}}
                />
            </NavLink>
            <NavLink
                href="#required-for-focus"
                label="Inventory"
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                childrenOffset={28}
            >
                <NavLink href="inventory/sales" label={t('Sales')} component="button" onClick={(e)=>{navigate('inventory/sales')}}  />
                <NavLink href="inventory/pos-sales" label={t('Manage POS')} component="button" onClick={(e)=>{navigate('inventory/pos-sales')}}  />
                <NavLink href="inventory/purchase" label={t('Manage Purchase')} component="button" onClick={(e)=>{navigate('inventory/purchase')}}  />
                <NavLink href="inventory/purchase-invoice" label={t('Purchase Invoice')} component="button" onClick={(e)=>{navigate('inventory/purchase-invoice')}}  />
                <NavLink href="inventory/product" label={t('Product')} component="button" onClick={(e)=>{navigate('inventory/product')}}  />
                <NavLink href="inventory/category" label={t('Category')} component="button" onClick={(e)=>{navigate('inventory/category')}}  />
                <NavLink href="inventory/category-group" label={t('CategoryGroup')} component="button" onClick={(e)=>{navigate('inventory/category-group')}}  />
                <NavLink href="config" label="Configuration" component="button" onClick={(e)=>{navigate('inventory/config')}}  />
            </NavLink>
            <NavLink
                href="#required-for-focus"
                label="Sample"
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                childrenOffset={28}
            >
                <NavLink href="sample" label="sample" component="button" onClick={(e)=>{navigate('sample')}}  />
            </NavLink>
        </>
  )
}

export default Navbar