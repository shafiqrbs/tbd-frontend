import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex } from '@mantine/core';
import SampleModal from './SampleModal';
import { IconPrinter } from '@tabler/icons-react';
import ReactToPrint from 'react-to-print';
import SalesPrint from './SalesPrint';
import { useRef } from 'react';


function SampleModalIndex() {
    const [opened, { open, close }] = useDisclosure(false);
    const componentRef = useRef();

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                // title="This is a fullscreen modal"
                fullScreen
                // size={`75%`}
                radius={0}

                h={'50px'}
                w={100}
                transitionProps={{ transition: 'pop', duration: 100 }}
            >
                <SampleModal />
            </Modal >
            <Button onClick={open} m={'lg'}>Open Modal</Button>





            {/* <ReactToPrint
                trigger={() => <Button m={'lg'}>Print</Button>}
                content={() => componentRef.current}
            />
            <SalesPrint ref={componentRef} /> */}

        </>
    );
}

export default SampleModalIndex;