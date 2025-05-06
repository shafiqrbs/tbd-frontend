import { Grid, Box, Text, Card, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import { useState } from "react";

export default function VoucherNavigation(props) {
  const { t, i18n } = useTranslation();
  const { activeTab, setActiveTab } = props;
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 184;
  const navItems = [
    "Customer Voucher",
    "Vendor Voucher",
    "Contra Voucher",
    "Debit Note",
    "CreditNote",
  ];

  return (
    <Box>
      <Card shadow="md" radius="4" className={classes.card} padding="xs">
        <Grid gutter={{ base: 2 }}>
          <Grid.Col span={11}>
            <Text fz="md" fw={500} className={classes.cardTitle}>
              {t("VoucherNavigation")}
            </Text>
          </Grid.Col>
        </Grid>
        <Grid columns={9} gutter={{ base: 1 }}>
          <Grid.Col span={9}>
            <Box bg={"white"}>
              <Box mt={8} pt={"8"}>
                <ScrollArea
                  h={height + 42}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                >
                  {navItems.map((item) => (
                    <Box
                      key={item}
                      style={{
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      className={`${classes["pressable-card"]} border-radius`}
                      mih={40}
                      mt={"4"}
                      variant="default"
                      onClick={() => setActiveTab(item)}
                      bg={activeTab === item ? "#f8eedf" : "gray.1"}
                    >
                      <Text size={"sm"} pt={8} pl={8} fw={500} c={"black"}>
                        {t(item)}
                      </Text>
                    </Box>
                  ))}
                </ScrollArea>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}
