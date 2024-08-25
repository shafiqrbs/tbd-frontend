import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Progress } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from '../../../global-hook/loading-progress/getLoadingProgress';

export default function _StockModal(props) {

    const { viewModal, setViewModal } = props;
    const { t, i18 } = useTranslation();
    const progress = getLoadingProgress();
    const [opened, { open, close }] = useDisclosure(false);
    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : []

    const closeModel = () => {
        setViewModal(false);
    }

    return (
        <>
            <>
                <Modal.Root opened={viewModal} onClose={closeModel}>
                    <Modal.Overlay />
                    <Modal.Content>
                        <Modal.Header>
                            <Modal.Title>Modal title</Modal.Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>Modal content</Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            </>
        </>
    );
}