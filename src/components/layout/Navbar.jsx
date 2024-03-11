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