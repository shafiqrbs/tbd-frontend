import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Progress, Tabs, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from '../../../global-hook/loading-progress/getLoadingProgress';
import { useEffect, useState } from 'react';
import __OverViewTab from './stock-tabs/__OverViewTab';

export default function _StockModal(props) {

    const { viewModal, setViewModal } = props;
    const { t, i18 } = useTranslation();
    const progress = getLoadingProgress();
    const [opened, { open, close }] = useDisclosure(false);
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : [];
    const [activeTab, setActiveTab] = useState('');
    useEffect(() => {
        setActiveTab('');
    }, []);

    const closeModel = () => {
        setViewModal(false);
    }

    return (
        <>
            <>
                <Modal.Root opened={viewModal} onClose={closeModel} fullScreen transitionProps={{ transition: 'fade', duration: 200 }}>
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header>
                            <Modal.Title>{t('StockDetails')}</Modal.Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <Box className="" bg={'#f0f1f9'} >
                                <Tabs
                                    height={50}
                                    p={4}
                                    bg={'#f0f1f9'}
                                    defaultValue='StockOverview'
                                    color="red.6" variant="pills" radius="sm"
                                    onChange={(value) => setActiveTab(value)}
                                >
                                    <Tabs.List pos={'relative'}>

                                        <Tabs.Tab
                                            m={2}
                                            value='StockOverview'
                                        >
                                            {t('StockOverview')}
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            m={2}
                                            value='Details'
                                        >
                                            {t('Details')}
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="StockOverview"  >
                                        <Box >
                                            <__OverViewTab />
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="Details" >
                                        <Box >
                                            uyfgcbh
                                        </Box>
                                    </Tabs.Panel>
                                </Tabs>

                            </Box>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            </>
        </>
    );
}