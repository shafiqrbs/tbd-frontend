import React  from 'react'
import { UnstyledButton, NavLink,Group, Avatar, Text, rem,Stack } from '@mantine/core';
import {
    IconGauge,
    IconChevronRight,
    IconSwitchHorizontal,
    IconLogout
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
            component={"CustomerIndex"}
            onClick={(e)=>{navigate('core/customer')}}
        />
        <NavLink
            href="user"
            label={t('Users')}
            component={"UserIndex"}
            onClick={(e)=>{navigate('core/user')}}
        />
        <NavLink
            href="user"
            label={t('Vendors')}
            component={"VendorIndex"}
            onClick={(e)=>{navigate('core/vendor')}}
        />
    </NavLink>
    <NavLink
        href="#required-for-focus"
        label="Sample"
        leftSection={<IconGauge size="1rem" stroke={1.5} />}
        childrenOffset={28}
    >
        <NavLink href="sample" label="sample" component={"DashBoard"} onClick={(e)=>{navigate('sample')}}  />
    </NavLink>
</>
  )
}

export default Navbar