import {useTranslation} from "react-i18next";
import {Box, Grid, Modal, useMantineTheme} from "@mantine/core";

function WarehouseViewModal({ warehouseObject, viewDrawer, setViewDrawer }) {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const CloseModal = () => {
        setViewDrawer(false);
    };

    return (
        <Modal
            opened={viewDrawer}
            onClose={CloseModal}
            title={t("WarehouseDetails")}
            size="75%"
            overlayProps={{
                color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.dark[8],
                opacity: 0.9,
                blur: 3,
            }}
        >
            <Box m="md">
                <Grid columns={24}>
                    <Grid.Col span="6" align="left" fw="600" fz="14">{t("Name")}</Grid.Col>
                    <Grid.Col span="1">:</Grid.Col>
                    <Grid.Col span="auto">{warehouseObject?.name}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span="6" align="left" fw="600" fz="14">{t("Location")}</Grid.Col>
                    <Grid.Col span="1">:</Grid.Col>
                    <Grid.Col span="auto">{warehouseObject?.location}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span="6" align="left" fw="600" fz="14">{t("ContractPerson")}</Grid.Col>
                    <Grid.Col span="1">:</Grid.Col>
                    <Grid.Col span="auto">{warehouseObject?.contract_person}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span="6" align="left" fw="600" fz="14">{t("Mobile")}</Grid.Col>
                    <Grid.Col span="1">:</Grid.Col>
                    <Grid.Col span="auto">{warehouseObject?.mobile}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span="6" align="left" fw="600" fz="14">{t("Email")}</Grid.Col>
                    <Grid.Col span="1">:</Grid.Col>
                    <Grid.Col span="auto">{warehouseObject?.email}</Grid.Col>
                </Grid>
                <Grid columns={24}>
                    <Grid.Col span="6" align="left" fw="600" fz="14">{t("Address")}</Grid.Col>
                    <Grid.Col span="1">:</Grid.Col>
                    <Grid.Col span="auto">{warehouseObject?.address}</Grid.Col>
                </Grid>
            </Box>
        </Modal>
    );
}

export default WarehouseViewModal;
