import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import { Progress, Box } from "@mantine/core";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar";
import BatchTable from './BatchTable'

export default function BatchIndex(){
    const progress = getLoadingProgress()
    const { t, i18n } = useTranslation();

    const [batchReloadWithUpload,setBatchReloadWithUpload] = useState(false)

    return (
        <>  
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    <ProductionHeaderNavbar
                        pageTitle={t('ProductionBatch')}
                        roles={t('Roles')}
                        setBatchReloadWithUpload={setBatchReloadWithUpload}
                    />
                    <Box p={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <BatchTable setBatchReloadWithUpload={setBatchReloadWithUpload} batchReloadWithUpload={batchReloadWithUpload}/>
                        </Box>
                    </Box>
                </Box>
            }

        </>
    )
}


                    