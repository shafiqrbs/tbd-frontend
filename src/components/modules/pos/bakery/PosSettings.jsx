import React from 'react'
import { Drawer, Box, Grid, Flex, ActionIcon, Title, Text, Group, Button, Stack, ScrollArea } from '@mantine/core'
import { useOutletContext } from 'react-router-dom';
import PosForm from '../../inventory/inventory-configuration/PosForm'

export default function PosSettings({settingsOpened, closeModel}) {
  const { mainAreaHeight } = useOutletContext();
  const domainConfigData = JSON.parse(localStorage.getItem('domain-config-data') || '{}')
  const id = domainConfigData?.id;
  const height = mainAreaHeight - 190; //TabList height 104

  return (
		<Drawer.Root opened={settingsOpened} position="right" onClose={closeModel} size={"30%"}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Box ml={2} mr={2} mb={0}>
					<PosForm height={height} id={id} enableExternalSubmit={true} closeModel={closeModel} />
				</Box>
			</Drawer.Content>
		</Drawer.Root>
  );
}
