import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Group, Menu, rem, Text } from "@mantine/core";
import classes from "../../../assets/css/HeaderSearch.module.css";
import { IconCreditCard, IconInfoCircle } from "@tabler/icons-react";

export default function ProcurementHeaderNavbar(props) {
  const { pageTitle, roles } = props;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const links = [
    {
      link: "/procurement/requisition",
      label: t("Requisition"),
    },
    {
      link: "/procurement/new-requisition",
      label: t("NewRequisition"),
    },
  ];
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => {
        event.preventDefault();
        navigate(link.link, { replace: true });
      }}
    >
      {link.label}
    </a>
  ));
  return (
    <>
      <header className={classes.header}>
        <div className={classes.inner}>
          <Group ml={10}>
            <Text>{pageTitle}</Text>
          </Group>
          <Group>
            <Group
              ml={50}
              gap={5}
              className={classes.links}
              visibleFrom="sm"
              mt={2}
            >
              {items}
            </Group>
            <Menu
              withArrow
              arrowPosition="center"
              trigger="hover"
              openDelay={100}
              closeDelay={400}
              mr={8}
            >
              <Menu.Target>
                <ActionIcon
                  mt={4}
                  variant="filled"
                  color="red.5"
                  radius="xl"
                  aria-label="Settings"
                >
                  <IconInfoCircle height={12} width={12} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component="button"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/procurement/purchase");
                  }}
                  leftSection={
                    <IconCreditCard
                      style={{ height: rem(12), width: rem(12) }}
                    />
                  }
                >
                  {t("Requisition")}
                </Menu.Item>
                <Menu.Item
                  component="button"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/procurement/new-requisition");
                  }}
                  leftSection={
                    <IconCreditCard
                      style={{ height: rem(12), width: rem(12) }}
                    />
                  }
                >
                  {t("NewRequisition")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </header>
    </>
  );
}
