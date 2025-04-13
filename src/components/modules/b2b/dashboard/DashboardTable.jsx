import {
  Group,
  Box,
  ActionIcon,
  Text,
  Menu,
  rem,
  Button,
  Container,
  SimpleGrid,
  Card,
  Grid,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  IconMoneybag,
} from "@tabler/icons-react";
import classes from "../../../../assets/css/FeaturesCards.module.css";

export default function DashBoardTable() {
  const { mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98;
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const perPage = 20;
  const [page, setPage] = useState(1);

  const [fetching, setFetching] = useState(false);
  const [indexData, setIndexData] = useState([]);
  useEffect(() => {
    setIndexData({
      data: [{ id: 1, name: "Uttara", status: "active" }],
      total: 10,
    });
  }, []);

  const [userRole, setUserRole] = useState(() => {
    const userRoleData = localStorage.getItem("user");
    if (!userRoleData) return [];

    try {
      const parsedUser = JSON.parse(userRoleData);
      return parsedUser.access_control_role
        ? JSON.parse(parsedUser.access_control_role)
        : [];
    } catch (error) {
      console.error("Error parsing user role data:", error);
      return [];
    }
  });
  //   console.log("userRole", userRole);
  return (
    <>
      <Box
        pl={`4`}
        pr={8}
        pt={"6"}
        pb={"4"}
        className={"borderRadiusAll"}
        bg={"white"}
      >
        <Container fluid mt={"xs"}>
          <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs" mb={"xs"}>
            <Card
              h={150}
              shadow="md"
              radius="md"
              className={classes.card}
              padding="lg"
            >
              <Grid gutter={{ base: 2 }}>
                <Grid.Col span={2}>
                  <IconMoneybag
                    style={{ width: rem(42), height: rem(42) }}
                    stroke={2}
                    color={theme.colors.blue[6]}
                  />
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text fz="md" fw={500} className={classes.cardTitle}>
                    {t("AccountingOverview")}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>
            <Card
              h={150}
              shadow="md"
              radius="md"
              className={classes.card}
              padding="lg"
            >
              <Grid gutter={{ base: 2 }}>
                <Grid.Col span={2}>
                  <IconMoneybag
                    style={{ width: rem(42), height: rem(42) }}
                    stroke={2}
                    color={theme.colors.blue[6]}
                  />
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text fz="md" fw={500} className={classes.cardTitle}>
                    {t("AccountingOverview")}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>
      <Box p={"xs"} bg={"white"} className={"borderRadiusAll"} mt={"4"}>
        <Box bg={"white"} className={"borderRadiusAll"}>
          <DataTable
            classNames={{
              root: tableCss.root,
              table: tableCss.table,
              header: tableCss.header,
              footer: tableCss.footer,
              pagination: tableCss.pagination,
            }}
            records={indexData.data}
            columns={[
              {
                accessor: "index",
                title: t("S/N"),
                textAlignment: "right",
                render: (item) => indexData.data.indexOf(item) + 1,
              },
              { accessor: "name", title: t("Name") },
              {
                accessor: "action",
                title: t("Action"),
                textAlign: "right",
                render: (data) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    {userRole.includes("role_accounting") && (
                      <Button
                        component="a"
                        size="compact-xs"
                        radius="xs"
                        variant="filled"
                        fw={"100"}
                        fz={"12"}
                        color="red.3"
                        mr={"4"}
                        onClick={() => {
                            navigate(`/b2b/sub-domain/category/${1}`);
                        }}
                      >
                        {t("Manage")}
                      </Button>
                    )}
                  </Group>
                ),
              },
            ]}
            fetching={fetching}
            totalRecords={indexData.total}
            recordsPerPage={perPage}
            page={page}
            onPageChange={(p) => {
              setPage(p);
              setFetching(true);
            }}
            loaderSize="xs"
            loaderColor="grape"
            height={height - 140}
            scrollAreaProps={{ type: "never" }}
          />
        </Box>
      </Box>
    </>
  );
}
