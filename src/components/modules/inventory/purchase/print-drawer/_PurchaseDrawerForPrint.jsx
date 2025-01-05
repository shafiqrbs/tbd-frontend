import React from "react";
import { ActionIcon, Box, Drawer, ScrollArea, Text } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconX, IconXboxX } from "@tabler/icons-react";
import PurchaseInvoiceDomain359Normal from "../print-component/PurchaseInvoiceDomain359Normal.jsx";
import _PurchaseInvoiceDomain359Custom from "../print-component/_PurchaseInvoiceDomain359Custom.jsx";
import PurchaseInvoiceDomain359Pos from "../print-component/PurchaseInvoiceDomain359Pos.jsx";

function _PurchaseDrawerForPrint(props) {
    const { openInvoiceDrawerForPrint, setOpenInvoiceDrawerForPrint, printType, mode } = props

    const { t, i18n } = useTranslation();
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []

    const close = () => {
        setOpenInvoiceDrawerForPrint(false)
    }
    return (
        <>
            <Drawer.Root
                radius="md"
                position="right"
                opened={openInvoiceDrawerForPrint}
                onClose={close}
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                size="40%"
                title={printType === 'pos' ? t('PosPrint') : t('NormalPrint')}
                scrollAreaComponent={ScrollArea.Autosize}
                transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
                closeButtonProps={{
                    icon: <IconXboxX size={20} stroke={1.5} />,
                }}
            >
                <Drawer.Overlay />
                <Drawer.Content>

                    <Drawer.Header>
                        <Drawer.Title>
                            <Text fw={'600'} fz={'16'}>
                                {printType === 'pos' ? t('PosPrint') : t('NormalPrint')}
                            </Text>
                        </Drawer.Title>
                        <ActionIcon
                            className="ActionIconCustom"
                            radius="xl"
                            color="red.6" size="lg"
                            onClick={close}
                        >
                            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Drawer.Header>
                    <Box mb={0} bg={'gray.1'} >
                        <Box p={'md'} className="boxBackground borderRadiusAll" >
                            { printType === 'pos' && <PurchaseInvoiceDomain359Pos mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />}
                            { printType === 'print' && <_PurchaseInvoiceDomain359Custom mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />}

                            {/*demo*/}

                            {/*{configData?.domain?.id == '359' && printType === 'pos' && <PurchaseInvoiceDomain359Pos mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />}
                            {configData?.domain?.id == '359' && printType === 'print' && <_PurchaseInvoiceDomain359Custom mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />}*/}

                            {/* {configData?.domain?.id == '359' && printType === 'print' && <PurchaseInvoiceDomain359Normal mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />} */}
                        </Box>
                    </Box>
                </Drawer.Content>

            </Drawer.Root >
        </>
    );
}

export default _PurchaseDrawerForPrint;
