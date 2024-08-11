import React from "react";
import { Drawer, ScrollArea } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconXboxX } from "@tabler/icons-react";
import _InvoiceForDomain359Pos from "../print-component/_InvoiceForDomain359Pos.jsx";
import _InvoiceForDomain359Normal from "../print-component/_InvoiceForDomain359Normal.jsx";
import InvoiceDomain359Normal from "../print-component/InvoiceDomain359Normal.jsx";
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
            <Drawer
                offset={8}
                radius="md"
                position="right"
                opened={openInvoiceDrawerForPrint}
                onClose={close}
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                size="lg"
                title={printType === 'pos' ? t('PosPrint') : t('NormalPrint')}
                scrollAreaComponent={ScrollArea.Autosize}
                transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
                closeButtonProps={{
                    icon: <IconXboxX size={20} stroke={1.5} />,
                }}
            >

                {/* {configData?.domain?.id == '359' && printType === 'pos' && <_InvoiceForDomain359Pos mode={mode} />} */}
                {configData?.domain?.id == '359' && printType === 'pos' && <InvoiceDomain359Pos mode={mode} />}
                {/* { configData?.domain?.id =='359' && printType==='print' && <_InvoiceForDomain359Normal  mode={mode}/> } */}
                {configData?.domain?.id == '359' && printType === 'print' && <InvoiceDomain359Normal mode={mode} />}
            </Drawer>
        </>
    );
}

export default _InvoiceDrawerForPrint;
