import {Modal, Tabs, Box, Progress} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import __ModalBoardDetails from "./__ModalBoardDetails.jsx";
import __ModalProductionProcess from "./__ModalProductionProcess.jsx";
import {getIndexEntityData} from "../../../../store/inventory/crudSlice.js";
import {useDispatch} from "react-redux";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress.js";

export default function _ProductionProcessModal(props) {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const {productionProcessModal, setProductionProcessModal, boardId} = props;
    const {t, i18} = useTranslation();
    const [activeTab, setActiveTab] = useState('BoardDetails');

    const closeModel = () => {
        setProductionProcessModal(false);
    }

    const [fetching, setFetching] = useState(false);
    const [indexData, setIndexData] = useState([]);
    const [customers, setCustomers] = useState([]);

    const fetchData = async () => {
        if (!boardId) return;

        setFetching(true);
        const value = {
            url: 'inventory/requisition/matrix/board/' + boardId,
            param: {}
        };

        try {
            const resultAction = await dispatch(getIndexEntityData(value));

            if (getIndexEntityData.fulfilled.match(resultAction)) {
                setIndexData(resultAction.payload.data || []);
                setCustomers(resultAction.payload.customers || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false); // Remove the setTimeout!
        }
    };

    useEffect(() => {
        fetchData();
    }, [boardId]); // Remove 'fetching' from dependencies

    return (
        <>
            <>
                <Modal.Root opened={productionProcessModal} onClose={closeModel} fullScreen
                            transitionProps={{transition: 'fade', duration: 200}}>
                    <Modal.Overlay/>
                    <Modal.Content>
                        <Modal.Header>
                            <Modal.Title>{t('ProductionProcess')}</Modal.Title>
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>
                            <Box className="" bg={'#f0f1f9'}>
                                <Tabs
                                    height={50}
                                    p={4}
                                    bg={'#f0f1f9'}
                                    defaultValue='BoardDetails'
                                    color="red.6" variant="pills" radius="sm"
                                    onChange={(value) => setActiveTab(value)}
                                >
                                    <Tabs.List pos={'relative'}>

                                        <Tabs.Tab
                                            m={2}
                                            value='BoardDetails'
                                        >
                                            {t('BoardDetails')}
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            m={2}
                                            value='Process'
                                        >
                                            {t('Process')}
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="BoardDetails">
                                        <Box>
                                            {fetching ? (
                                                <Progress
                                                    color='var(--theme-primary-color-6)'
                                                    size="sm"
                                                    striped
                                                    animated
                                                    value={progress}
                                                    transitionDuration={200}
                                                />
                                            ) : (
                                                boardId && indexData && customers &&
                                                <__ModalBoardDetails boardId={boardId} indexData={indexData}
                                                                     customers={customers}/>
                                            )}
                                        </Box>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="Process">
                                        <Box>
                                            {fetching ? (
                                                <Progress
                                                    color='var(--theme-primary-color-6)'
                                                    size="sm"
                                                    striped
                                                    animated
                                                    value={progress}
                                                    transitionDuration={200}
                                                />
                                            ) : (
                                                boardId && indexData && customers &&
                                                <__ModalProductionProcess boardId={boardId} indexData={indexData}
                                                                          customers={customers}/>
                                            )}

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