import {Modal, Box} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import __ReconciliationProcess from "./__ReconciliationProcess.jsx";

export default function _SalesReconciliationModal(props) {
    const {salesReconciliationModal, setSalesReconciliationModal} = props;
    const {t, i18} = useTranslation();

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
                                <Box>
                                    <__ReconciliationProcess closeModel={closeModel}/>
                                </Box>
                            </Box>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            </>
        </>
    );
}