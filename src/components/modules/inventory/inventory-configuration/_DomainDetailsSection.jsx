import { Box, Title, ScrollArea, Grid } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function DomainDetailsSection({ domainConfig, height }) {
    const {t} = useTranslation();
  return (
    <>
      <Box bg={"white"} p={"xs"} pb={"xs"} className={"borderRadiusAll"}>
        <Box
          h={48}
          pl={`xs`}
          pr={8}
          pt={"xs"}
          mb={"6"}
          className={"boxBackground borderRadiusAll"}
        >
          <Title order={6} pl={"6"} pt={4}>
            {t("DomainDetails")}
          </Title>
        </Box>
        <Box mb={0} bg={"gray.1"} h={height}>
          <Box p={"md"} className="borderRadiusAll" h={height}>
            <ScrollArea h={height - 176} type="never">
              <Grid columns={24}>
                <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                  {t("Name")}
                </Grid.Col>
                <Grid.Col span={1}>:</Grid.Col>
                <Grid.Col span={14}>
                  {domainConfig && domainConfig?.name}
                </Grid.Col>
              </Grid>

              <Grid columns={24}>
                <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                  {t("Mobile")}
                </Grid.Col>
                <Grid.Col span={1}>:</Grid.Col>
                <Grid.Col span={14}>
                  {domainConfig && domainConfig?.mobile}
                </Grid.Col>
              </Grid>

              <Grid columns={24}>
                <Grid.Col span={9} align={"left"} fw={"600"} fz={"14"}>
                  {t("Email")}
                </Grid.Col>
                <Grid.Col span={1}>:</Grid.Col>
                <Grid.Col span={14}>
                  {domainConfig && domainConfig?.email}
                </Grid.Col>
              </Grid>
            </ScrollArea>
          </Box>
        </Box>
      </Box>
    </>
  );
}
