import { Box, Grid, Image, ScrollArea, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import { useState } from "react";
import { DataTable } from "mantine-datatable";
import KeywordSearch from "../../filter/KeywordSearch";

export default function BarcodePrintView(props) {
  const { preview, setPreview } = props;
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98;
  const [indexData, setIndexData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const images = [
    {
      id: 1,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 2,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 3,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 4,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 5,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 6,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 7,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 8,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 9,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
    {
      id: 10,
      src: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    },
  ];
  const perPage = 50;
  return (
    <>
      <Box
        pl={`xs`}
        pr={8}
        pt={"6"}
        pb={"4"}
        className={"boxBackground borderRadiusAll"}
      >
        <Title order={6} pt={6} pb={4}>
          {t("Preview")}
        </Title>
      </Box>
      <Box mt={"4"} className={"borderRadiusAll"}>
        <ScrollArea
          h={height}
          scrollbarSize={2}
          scrollbars="y"
          type="never"
          p={"xs"}
        >
          {preview &&
            Array.from({ length: Math.ceil(images.length / 3) }).map(
              (_, rowIndex) => (
                <Grid
                  key={`row-${rowIndex}`}
                  columns={24}
                  gutter={{ base: 8 }}
                  align="center"
                  justify="flex-start"
                  mt={"sm"}
                >
                  {images.slice(rowIndex * 3, rowIndex * 3 + 3).map((image) => (
                    <Grid.Col key={image.id} span={8} p={8} align="center">
                      <Image h={200} w={200} radius="md" src={image.src} />
                    </Grid.Col>
                  ))}
                </Grid>
              )
            )}
        </ScrollArea>
      </Box>
    </>
  );
}
