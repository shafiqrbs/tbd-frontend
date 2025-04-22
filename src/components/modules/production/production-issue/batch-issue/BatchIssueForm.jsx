import { Box, Grid } from "@mantine/core";
import ProductionNavigation from "../../common/ProductionNavigation";

export default function BatchIssueForm(props) {
  const { isWarehouse } = props;
  return (
    <>
      <Box>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={1}>
            <ProductionNavigation module={"production-issue"} type={""} />
          </Grid.Col>
          <Grid.Col span={7}></Grid.Col>
          <Grid.Col span={16}></Grid.Col>
        </Grid>
      </Box>
    </>
  );
}
