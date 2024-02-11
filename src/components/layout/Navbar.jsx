import React, { useState } from 'react'
import NavbarStyle from '../../assets/css/Navbar.module.css'
import {ScrollArea, Box, NavLink} from '@mantine/core'
import _NavbarList from './_NavbarList'
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock, IconFingerprint,
} from '@tabler/icons-react';
import _Form from "../dashboard/_Form";
import {useNavigate} from "react-router-dom";


const mockdata = [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Market news',
      icon: IconNotes,
      initiallyOpened: false,
      links: [
        { label: 'Overview', link: '/stock',component:'_Form' },
        { label: 'Forecasts', link: '/' },
        { label: 'Outlook', link: '/' },
        { label: 'Real time', link: '/' },
      ],
    },
    {
      label: 'Releases',
      icon: IconCalendarStats,
      links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
      ],
    },
    { label: 'Analytics', icon: IconPresentationAnalytics },
    { label: 'Contracts', icon: IconFileAnalytics },
    { label: 'Settings', icon: IconAdjustments },
    {
      label: 'Security',
      icon: IconLock,
      links: [
        { label: 'Enable 2FA', link: '/' },
        { label: 'Change password', link: '/' },
        { label: 'Recovery codes', link: '/' },
      ],
    },
  ];
function Navbar() {
    const navigate = useNavigate()

    const links = mockdata.map((item) => <_NavbarList {...item} key={item.label} />);
    // console.log(links)

  return (
<>
    {/*<NavLink href="Dashboard" label="Dashboard" component={"Dashboard"} onClick={(e)=>{
        navigate('stock')
    }}  />*/}
      <NavLink
          href="#required-for-focus"
          label="Inventory"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
          childrenOffset={28}
      >
          <NavLink href="sample" label="sample" component={'test'}  onClick={(e)=>{navigate('sample')}}  />
          <NavLink href="crud" label="Crud" component={"Crud"} onClick={(e)=>{navigate('crud')}}  />
          <NavLink href="stock" label="Stock" component={"_Form"} onClick={(e)=>{navigate('stock')}}  />
          <NavLink href="datatable" label="datatable" component={"_Datatable"} onClick={(e)=>{navigate('datatable')}}  />
          <NavLink href="another" label="Another" component={"_AnotherFormLayout"} onClick={(e)=>{navigate('another')}}  />
          {/*<NavLink label="Second child link" href="#required-for-focus" />*/}
          {/*<NavLink label="Item" childrenOffset={28} href="#required-for-focus">
              <NavLink label="New Item" href="#required-for-focus" />
              <NavLink label="My Item" href="#required-for-focus" />
          </NavLink>*/}
      </NavLink>

    </>
    /*<ScrollArea className={NavbarStyle.links} scrollbarSize={3}>

        <Box py={`var(--mantine-spacing-xs)`}>{links}</Box>
     
    </ScrollArea>*/
  )
}

export default Navbar