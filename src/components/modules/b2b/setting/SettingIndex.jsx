import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Box, Button,
  Card,
  Container, Flex,
  Grid,
  Progress,
  rem, ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _Shortcut from "../common/_Shortcut.jsx";
import DomainHeaderNavbar from "../../domain/DomainHeaderNavbar.jsx";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {IconDeviceFloppy, IconMoneybag} from "@tabler/icons-react";
import CategoryGroupForm from "../../inventory/category-group/CategoryGroupForm";
import SubDomainSettingForm from "./SubDomainSettingForm";

export default function SettingIndex() {
  const { id } = useParams();
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const progress = getLoadingProgress();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight+20;
  return (
    <>
      {progress !== 100 && (
        <Progress color="red" size={"sm"} striped animated value={progress} />
      )}
      {progress === 100 && (
        <>
          <DomainHeaderNavbar
            pageTitle={t("Dashboard")}
            roles={t("Roles")}
            allowZeroPercentage=""
            currencySymbol=""
          />
          <Box p={"8"} h={height} bg="white" type="never">
            <Grid columns={24} gutter={{ base: 8 }}>
              <Grid.Col span={1}>
                <_Shortcut id={id} />
              </Grid.Col>
              <Grid.Col span={23}>
                <Box
                    pl={`4`}
                    pr={8}
                    pt={"6"}
                    pb={"4"}
                    className={"borderRadiusAll"}
                    bg={"white"}
                >
                  <Container fluid mt={"xs"}>
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xs" mb={"xs"}>
                      <Card
                          shadow="md"
                          radius="md"
                          className={classes.card}
                          padding="lg"
                      >
                        <Grid gutter={{ base: 2 }}>
                          <Grid.Col span={10}>
                            <Text fz="md" fw={500} className={classes.cardTitle}>
                              {t("AccountingOverview")}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <SubDomainSettingForm />
                      </Card>
                      <Card
                          shadow="md"
                          radius="md"
                          className={classes.card}
                          padding="lg"
                      >
                        <Grid gutter={{ base: 2 }}>
                          <Grid.Col span={12}>
                            <Text fz="md" fw={500} className={classes.cardTitle}>
                              {t("AccountingOverview")}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <SubDomainSettingForm />
                      </Card>
                      <Card
                          shadow="md"
                          radius="md"
                          className={classes.card}
                          padding="lg"
                      >
                        <Grid gutter={{ base: 2 }}>

                          <Grid.Col span={10}>
                            <Text fz="md" fw={500} className={classes.cardTitle}>
                              {t("AccountingOverview")}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={2}>
                            <Stack right align="flex-end">
                              <>
                                <Button
                                    size="xs"
                                    color={`green.8`}
                                    type="submit"
                                    id="EntityFormSubmit"
                                    leftSection={<IconDeviceFloppy size={16} />}
                                >

                                  <Flex direction={`column`} gap={0}>
                                    <Text fz={14} fw={400}>
                                      {t("CreateAndSave")}
                                    </Text>
                                  </Flex>
                                </Button>
                              </>
                            </Stack>
                          </Grid.Col>
                        </Grid>
                        <SubDomainSettingForm />
                      </Card>
                    </SimpleGrid>
                  </Container>
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
