import React  from 'react'
import {NavLink, Text} from '@mantine/core';
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
                <NavLink href="inventory/sales-invoice" label={t('Manage Invoice')} component="button" onClick={(e)=>{navigate('inventory/sales-invoice')}}  />
                <NavLink href="inventory/purchase" label={t('Manage Purchase')} component="button" onClick={(e)=>{navigate('inventory/purchase')}}  />
                <NavLink href="inventory/purchase-invoice" label={t('Purchase Invoice')} component="button" onClick={(e)=>{navigate('inventory/purchase-invoice')}}  />
                <NavLink href="inventory/product" label={t('Product')} component="button" onClick={(e)=>{navigate('inventory/product')}}  />
                <NavLink href="inventory/category" label={t('Category')} component="button" onClick={(e)=>{navigate('inventory/category')}}  />
                <NavLink href="inventory/category-group" label={t('CategoryGroup')} component="button" onClick={(e)=>{navigate('inventory/category-group')}}  />
                <NavLink href="config" label="Configuration" component="button" onClick={(e)=>{navigate('inventory/config')}}  />
            </NavLink>

            <NavLink
                href="#required-for-focus"
                label="Domain"
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                childrenOffset={28}
            >
                <NavLink href="domain" label={t("Domain")} component="button" onClick={(e)=>{navigate('domain')}}  />
            </NavLink>

            <NavLink
                href="#required-for-focus"
                label={t('Accounting')}
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                childrenOffset={28}
            >
                <NavLink href="accounting" label={t("TransactionMode")} component="button" onClick={(e)=>{navigate('accounting/transaction-mode')}}  />
            </NavLink>

            <NavLink
                href="#required-for-focus"
                label="Sample"
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                childrenOffset={28}
            >
                <NavLink href="sample" label="sample" component="button" onClick={(e)=>{navigate('sample')}}  />
                <NavLink href="sample/invoice" label="Invoice" component="button" onClick={(e)=>{navigate('sample/invoice')}}  />
                <NavLink href="sample/index" label="Table" component="button" onClick={(e)=>{navigate('sample/index')}}  />
            </NavLink>
        </>
  )
}

export default Navbar