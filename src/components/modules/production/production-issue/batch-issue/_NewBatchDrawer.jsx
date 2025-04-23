import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ActionIcon,
  Box,
  ScrollArea,
  Drawer,
  Flex,
  Button,
  Progress,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import InhouseIndex from "../../production-inhouse/InhouseIndex";
import { getLoadingProgress } from "../../../../global-hook/loading-progress/getLoadingProgress";

export default function _NewBatchDrawer(props) {
  const { batchDrawer, setBatchDrawer } = props;
  const { mainAreaHeight } = useOutletContext();
  const { t } = useTranslation();
  const height = mainAreaHeight;
  const [batchId, setBatchId] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeDrawer = () => {
    setBatchDrawer(false);
    setBatchId(null);
  };
  useEffect(() => {
    setLoading(true);
  }, []);
  useEffect(() => {
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_GATEWAY_URL + "production/batch"}`,
      headers: {
        Accept: `application/json`,
        "Content-Type": `application/json`,
        "Access-Control-Allow-Origin": "*",
        "X-Api-Key": import.meta.env.VITE_API_KEY,
        "X-Api-User": JSON.parse(localStorage.getItem("user")).id,
      },
      data: {
        mode: "in-house",
      },
    })
      .then((res) => {
        if (res.data.status === 200) {
          setBatchId(res.data.data.id);
        }
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
  }, []);

  useEffect(() => {
    if (batchId) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [batchId]);

  const progress = getLoadingProgress();
  return (
    <>
      <Drawer.Root
        opened={batchDrawer}
        position="right"
        onClose={closeDrawer}
        size={"100%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollArea
            h={height + 100}
            scrollbarSize={2}
            type="never"
            bg={"gray.1"}
          >
            <Flex
              mih={40}
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                mr={"sm"}
                radius="xl"
                color="grey.6"
                size="md"
                variant="outline"
                onClick={closeDrawer}
              >
                <IconX style={{ width: "80%", height: "80%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>
            <Box ml={2} mr={2} mb={0}>
              {batchId && (
                <InhouseIndex batchId={batchId} />
              )}
            </Box>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
