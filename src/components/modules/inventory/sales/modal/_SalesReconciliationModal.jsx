import {Modal, Tabs, Box, Progress} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {useDispatch} from "react-redux";
import {getLoadingProgress} from "../../../../global-hook/loading-progress/getLoadingProgress.js";
import __ReconciliationProcess from "./__ReconciliationProcess.jsx";

export default function _SalesReconciliationModal(props) {
    const {salesReconciliationModal, setSalesReconciliationModal} = props;
    const {t, i18} = useTranslation();
    const [activeTab, setActiveTab] = useState('BoardDetails');

    const closeModel = () => {
        setSalesReconciliationModal(false);
    }

    return (
        <>
            <>
                <Modal.Root
                    opened={salesReconciliationModal}
                    onClose={closeModel}
                    fullScreen
                    transitionProps={{transition: 'fade', duration: 200}}>
                    <Modal.Overlay/>
                    <Modal.Content>
                        <Modal.Header>
                            <Modal.Title>{t('SalesReconciliationProcess')}</Modal.Title>
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>
                            <Box className="" bg={'#f0f1f9'}>
                                <Tabs
                                    height={50}
                                    p={4}
                                    bg={'#f0f1f9'}
                                    defaultValue='SalesReconciliation'
                                    color="red.6" variant="pills" radius="sm"
                                    onChange={(value) => setActiveTab(value)}
                                >
                                    <Tabs.List pos={'relative'}>
                                        <Tabs.Tab
                                            m={2}
                                            value='SalesReconciliation'
                                        >
                                            {t('SalesReconciliation')}
                                        </Tabs.Tab>
                                        {/*<Tabs.Tab
                                            m={2}
                                            value='Process'
                                        >
                                            {t('Production')}
                                        </Tabs.Tab>*/}
                                    </Tabs.List>
                                    <Tabs.Panel value="SalesReconciliation">
                                        <Box>
                                            <__ReconciliationProcess />
                                        </Box>
                                    </Tabs.Panel>
                                    {/*<Tabs.Panel value="Process">
                                        <Box>
                                            <__ModalProductionProcess boardId={boardId}/>
                                        </Box>
                                    </Tabs.Panel>*/}
                                </Tabs>

                            </Box>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            </>
        </>
    );
}