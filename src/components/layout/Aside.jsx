import React from 'react'
import {IconFilter, IconSearch, IconDeviceFloppy, IconRestore,IconArrowUp, IconPlus, IconTableShortcut} from "@tabler/icons-react";
import {Button, Flex, Group, LoadingOverlay, Text, Tooltip, Grid, Title, Box,Affix,Transition} from "@mantine/core";
import {useTranslation} from "react-i18next";
import { useWindowScroll } from '@mantine/hooks';
function Aside() {
  const {t, i18n} = useTranslation();
  const [scroll, scrollTo] = useWindowScroll();
  return (
      <>
    <Box mr={8}>
      <Box mx="auto" ta="center" h={40}>
        <Text order={6} c={'indigo'} fz={10} fw={900} pt={'0'} ></Text>
      </Box>
      <Tooltip
          label={t('CrtlfText')}
          px={16}
          py={2}
          withArrow
          position={"left"}
          c={'indigo'}
          bg={`gray.1`}
          transitionProps={{transition: "pop-bottom-left", duration: 500}}
      >
        <Button
            size="lg"
            mb={16}
            pl={'16'}
            pr={'16'}
            variant={'light'}
            color={`indigo`}
            radius="xl"
        >
          <Flex direction={`column`} align={'center'}>
            <IconSearch size={16}/>
            <Text fz={8}>
              {t('alt+f')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>

      <Tooltip
          label={t('CrtlnText')}
          px={16}
          py={2}
          withArrow
          position={"left"}
          c={'indigo'}
          bg={`gray.1`}
          transitionProps={{transition: "pop-bottom-left", duration: 500}}
      >
        <Button
            size="lg"
            mb={16}
            pl={'16'}
            pr={'16'}
            variant={'light'}
            color={`indigo`}
            radius="xl"
        >
          <Flex direction={`column`} align={'center'}>
            <IconPlus size={16}/>
            <Text fz={8}>
              {t('alt+n')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>
      <Tooltip
          label={t('CrtlrText')}
          px={16}
          py={2}
          withArrow
          position={"left"}
          c={'indigo'}
          bg={`gray.1`}
          transitionProps={{transition: "pop-bottom-left", duration: 500}}
      >
        <Button
            size="lg"
            mb={16}
            pl={'16'}
            pr={'16'}
            variant={'light'}
            color={`indigo`}
            radius="xl"
        >
          <Flex direction={`column`} align={'center'}>

            <IconRestore size={16}/>
            <Text fz={8}>
              {t('alt+r')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>
      <Tooltip
          label={t('CrtlsText')}
          px={16}
          py={2}
          withArrow
          position={"left"}
          c={'indigo'}
          bg={`gray.1`}
          transitionProps={{transition: "pop-bottom-left", duration: 500}}
      >
        <Button
            size="lg"
            mb={16}
            pl={'16'}
            pr={'16'}
            variant={'filled'}
            color={`indigo`}
            radius="xl"
        >
          <Flex direction={`column`} align={'center'}>

            <IconDeviceFloppy size={16}/>
            <Text fz={8}>
              {t('alt+s')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>

    </Box>
      </>
  )
}

export default Aside