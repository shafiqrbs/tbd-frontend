import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight, IconChevronRightPipe } from '@tabler/icons-react';
import NavbarStyle from '../../assets/css/Navbar.module.css';


function _NavbarList({ icon, label, initiallyOpened, links }) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const items = (hasLinks ? links : []).map((link) => (
        <Text
            component="a"
            className={NavbarStyle.link}
            href={link.link}
            key={link.label}
            onClick={(event) => event.preventDefault()}
        >
        {link.label}
        </Text>
    ));
  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={NavbarStyle.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {/* <ThemeIcon variant="light" size={30}>
              <IconChevronRightPipe style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon> */}
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={NavbarStyle.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}

export default _NavbarList