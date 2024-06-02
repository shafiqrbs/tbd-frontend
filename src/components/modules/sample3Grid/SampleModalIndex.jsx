import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex, Progress, Box, Grid } from '@mantine/core';
import SampleModal from './SampleModal';
import { IconPrinter } from '@tabler/icons-react';
import ReactToPrint from 'react-to-print';
import { useOutletContext } from "react-router-dom";
import SalesPrint from './SalesPrint';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AccountingHeaderNavbar from '../accounting/AccountingHeaderNavbar';
import { getLoadingProgress } from '../../global-hook/loading-progress/getLoadingProgress';


function SampleModalIndex() {
    const { t, i18n } = useTranslation();
    const [opened, { open, close }] = useDisclosure(false);
    const componentRef = useRef();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const progress = getLoadingProgress()
    const height = mainAreaHeight - 128; //TabList height 104
    return (
        <>

            <Modal
                opened={opened}
                onClose={close}
                // title="This is a fullscreen modal"
                fullScreen
                // size={`75%`}
                radius={0}

                // h={'50px'}
                w={100}
                transitionProps={{ transition: 'pop', duration: 100 }}
            >
                <SampleModal />
            </Modal >
            {progress !== 100 && <Progress color="red" size={"xs"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <AccountingHeaderNavbar
                        pageTitle={t('ManageCustomer')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} h={height} >
                                    <Button onClick={open} m={'lg'}>Open Modal</Button>
                                </Box>
                            </Grid.Col>

                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default SampleModalIndex;