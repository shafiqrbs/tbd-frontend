import React, { useState } from 'react'
import NavbarStyle from '../../assets/css/Navbar.module.css'
import {ScrollArea, Box} from '@mantine/core'
import _NavbarList from './_NavbarList'
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
  } from '@tabler/icons-react';

const mockdata = [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Market news',
      icon: IconNotes,
      initiallyOpened: false,
      links: [
        { label: 'Overview', link: '/' },
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
    const links = mockdata.map((item) => <_NavbarList {...item} key={item.label} />);

  return (
    <ScrollArea className={NavbarStyle.links} scrollbarSize={3}>

        <Box py={`var(--mantine-spacing-xs)`}>{links}</Box>
     
    </ScrollArea>
  )
}

export default Navbar