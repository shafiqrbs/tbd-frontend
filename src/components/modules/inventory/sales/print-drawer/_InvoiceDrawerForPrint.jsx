import React from "react";
import { ActionIcon, Box, Drawer, ScrollArea, Text } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconX, IconXboxX } from "@tabler/icons-react";
import _InvoiceForDomain359Pos from "../print-component/_InvoiceForDomain359Pos.jsx";
import _InvoiceForDomain359Normal from "../print-component/_InvoiceForDomain359Normal.jsx";
import _InvoiceForDomain359Custom from "../print-component/_InvoiceForDomain359Custom.jsx";
import InvoiceDomain359Pos from "../print-component/InvoiceDomain359Pos.jsx";

function _InvoiceDrawerForPrint(props) {
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
                            {(configData?.domain?.id == '359' || configData?.domain?.id == '379') && printType === 'pos' && <InvoiceDomain359Pos mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />}
                            {/* { configData?.domain?.id =='359' && printType==='print' && <_InvoiceForDomain359Normal  mode={mode}/> } */}
                            {/* {configData?.domain?.id == '359' && printType === 'print' && <InvoiceDomain359Normal mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />} */}
                            {(configData?.domain?.id == '359' || configData?.domain?.id == '379') && <_InvoiceForDomain359Custom mode={mode} setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint} />}
                        </Box>
                    </Box>
                </Drawer.Content>

                {/* {configData?.domain?.id ? (
                    (configData?.domain?.id == '359' && printType === 'pos' &&
                        <InvoiceDomain359Pos
                            mode={mode}
                            setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint}
                        />
                    ) ||
                    (configData?.domain?.id == '359' && printType === 'print' &&
                        <InvoiceDomain359Normal
                            mode={mode}
                            setOpenInvoiceDrawerForPrint={setOpenInvoiceDrawerForPrint}
                        />
                    )
                ) : (
                    printType === 'print' && <_InvoiceForDomain359Normal mode={mode} />
                )} */}
                {/* {configData?.domain?.id == '359' && printType === 'pos' && <_InvoiceForDomain359Pos mode={mode} />} */}

            </Drawer.Root >
        </>
    );
}

export default _InvoiceDrawerForPrint;
