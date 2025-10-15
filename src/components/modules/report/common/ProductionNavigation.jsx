import React from "react";
import {
  IconDashboard,
  IconCategory,
  IconIcons,
  IconShoppingBag,
  IconShoppingCart,
  IconCopyCheck,
} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, ScrollArea} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useNavigate, useOutletContext} from "react-router-dom";
import axios from "axios";

const navItems = [
  {
    labelKey: "UserWarehouse",
    icon: <IconDashboard size={16} color="white"/>,
    color: "#E53935",
    path: "/production/user-warehouse",
    create:false,
    route:''
  },

  {
    labelKey: "GeneralIssue",
    icon: <IconDashboard size={16} color="white"/>,
    color: "#4CAF50",
    path: "/production/issue-production/general",
    create:false,
    route:''
  },

  {
    labelKey: "BatchIssue",
    icon: <IconDashboard size={16} color="white"/>,
    color: "#4CAF50",
    path: "/production/issue-production/batch",
    create:false,
    route:''
  },

  {
    labelKey: "NewBatch",
    icon: <IconCategory size={16} color="white"/>,
    color: "#10B981",
    path: "/production/batch",
    create: true,
    route:'production/batch'
  },
  {
    labelKey: "ProductionBatch",
    icon: <IconIcons size={16} color="white"/>,
    color: "#3F51B5",
    path: "/production/batch",
    create: false,
    route:''
  },
  {
    labelKey: "ProductionItems",
    icon: <IconShoppingBag size={16} color="white"/>,
    color: "#F59E0B",
    path: "/production/items",
    create: false,
    route:''
  },
  {
    labelKey: "ProductionSetting",
    icon: <IconShoppingCart size={16} color="white"/>,
    color: "#06B6D4",
    path: "/production/setting",
    create: false,
    route:''
  },
  {
    labelKey: "ProductionConfig",
    icon: <IconCopyCheck size={16} color="white"/>,
    color: "#10B981",
    path: "/production/config",
    create: false,
    route:''
  },
];

const NavButton = ({icon, label, color, onClick}) => {
  const {t} = useTranslation();

  return (
      <Flex direction="column" align="center" mt="xs" pt={5}>
        <Tooltip
            label={t(label)}
            px={16}
            py={2}
            withArrow
            position="left"
            c="white"
            bg={color}
            transitionProps={{transition: "pop-bottom-left", duration: 500}}
        >
          <Button
              bg={color}
              size="md"
              pl="12"
              pr="12"
              variant="light"
              color="black"
              radius="xl"
              onClick={onClick}
          >
            <Flex direction="column" align="center">
              {icon}
            </Flex>
          </Button>
        </Tooltip>
        <Text mt={4} size="xs" c="black" ta="center" w={58} style={{wordBreak: "break-word", hyphens: "auto"}}>
          {t(label)}
        </Text>
      </Flex>
  );
};

export default function ProductionNavigation() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {mainAreaHeight} = useOutletContext();
  const height = mainAreaHeight - 20;

  const productionCreateApiCall = async (route, path) => {
    try {
      // Initialize data based on path
      let data = {};
      switch (path) {
        case "/production/batch":
          data = { mode: "in-house" };
          break;
        default:
          data = {};
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API_GATEWAY_URL}${route}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-Api-Key": import.meta.env.VITE_API_KEY,
          "X-Api-User": user.id,
        },
        data,
      });

      const res = response.data;

      // Handle successful response
      if ([200].includes(res.status) && res.data?.id) {
        const navigationMap = {
          "production/batch": `/production/batch/${res.data.id}`,
        };

        const navigateTo = navigationMap[route]?.[path] || navigationMap[route];
        if (navigateTo) {
          navigate(navigateTo);
        }
      } else {
        throw new Error(res.message || "Unexpected response from server.");
      }
    } catch (error) {
      console.error("API call failed:", error);
      const message = error.response?.data?.message || error.message || "Something went wrong.";
    }
  };

  return (
      <ScrollArea h={height} bg="white" type="never" className="border-radius">
        <Flex direction="column" align="center" gap="16">
          {navItems.map((item, index) => (
              <NavButton
                  key={index}
                  icon={item.icon}
                  label={item.labelKey}
                  color={item.color}
                  onClick={() =>{
                    if (item.create && item.route) {
                      productionCreateApiCall(item.route,item.path)
                    }else {
                      navigate(item.path)
                    }
                  }}
              />
          ))}
        </Flex>
      </ScrollArea>
  );
}
