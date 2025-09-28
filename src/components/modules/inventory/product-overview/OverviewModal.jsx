import { useDisclosure } from '@mantine/hooks';
import { Modal, Tabs, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from '../../../global-hook/loading-progress/getLoadingProgress.js';
import { useEffect, useState } from 'react';
import OverViewDetails from './OverViewDetails.jsx';

export default function OverviewModal(props) {

    const { viewModal, setViewModal } = props;
    const { t, i18 } = useTranslation();
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
                            <Modal.Title>{t('ProductDetails')}</Modal.Title>
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
                                            <OverViewDetails />
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="Details" >
                                        <Box >
                                            
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