import React from 'react'
import {IconFilter, IconSearch, IconDeviceFloppy, IconRestore,IconArrowUp, IconPlus, IconTableShortcut} from "@tabler/icons-react";
import {Button, Flex, Group, LoadingOverlay, Text, Tooltip, Grid, Title, Box,Affix,Transition} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useHotkeys, useWindowScroll} from '@mantine/hooks';
function Shortcut(props) {
  const {t, i18n} = useTranslation();
  const [scroll, scrollTo] = useWindowScroll();
  return (
      <>
    <Box mr={8}>
      <Box mx="auto" ta="center" h={42}>
        <Text order={6} c={'indigo'} fz={10} fw={900} pt={'8'} >{t('ShortCut')}</Text>
      </Box>
      <Box h={1} bg={`gray.1`} mb={'md'}></Box>
      <Tooltip
          label={t('AltText')}
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
            onClick={()=>{
              document.getElementById(props.shiftF).focus();
            }}
        >
          <Flex direction={`column`} align={'center'}>
            <IconSearch size={16}/>
            <Text fz={10}>
              {t('Alt+f')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>

      <Tooltip
          label={t('AltnText')}
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
            onClick={()=>{
              document.getElementById(props.shiftN).focus();
            }}
        >
          <Flex direction={`column`} align={'center'}>
            <IconPlus size={16}/>
            <Text fz={10}>
              {t('Alt+n')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>
      <Tooltip
          label={t('AltrText')}
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
            onClick={(e)=>{
              props.shiftR.reset()
            }}
        >
          <Flex direction={`column`} align={'center'}>

            <IconRestore size={16}/>
            <Text fz={10}>
              {t('Alt+r')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>
      <Tooltip
          label={t('AltsText')}
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
            onClick={()=>{
              document.getElementById(props.shiftS).click()
            }}
        >
          <Flex direction={`column`} align={'center'}>

            <IconDeviceFloppy size={16}/>
            <Text fz={10}>
              {t('Alt+s')}
            </Text>
          </Flex>
        </Button>
      </Tooltip>

    </Box>

      </>
  )
}

export default Shortcut