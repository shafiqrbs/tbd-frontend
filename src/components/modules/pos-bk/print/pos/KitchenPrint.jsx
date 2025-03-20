import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import classes from "./SalesPrintPos.module.css";
import { Grid, Text } from "@mantine/core";

export default function KitchenPrint(props) {
  const { selectedProducts, setPrint, salesByUserName } = props;
  const componentRef = useRef();
  const effectRan = useRef(false);

  const { t, i18n } = useTranslation();

  const configData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];
  const imageSrc = `${
    import.meta.env.VITE_IMAGE_GATEWAY_URL
  }uploads/inventory/logo/${configData.path}`;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    !effectRan.current &&
      (handlePrint(), setPrint(false), (effectRan.current = true));
  }, []);
  console.log("selectedProducts", selectedProducts);
  return (
    <>
      <div className={classes["pos-body"]} ref={componentRef}>
        <header className={classes["body-head"]}>
          <div className={classes["pos-head"]}>
            <img src={imageSrc} alt="logo" className={classes["head-img"]} />
            <h3 className={classes["head-title"]}>{configData.domain.name}</h3>
            <Grid
              columns={24}
              gutter={0}
              className={`${classes["head-phone"]} ${classes["text-width-two"]}`}
              mt={"xs"}
            >
              <Grid.Col span={6}>{t("Email")}</Grid.Col>
              <Grid.Col span={2}>:</Grid.Col>
              <Grid.Col span={16}>{configData?.domain?.email}</Grid.Col>
            </Grid>
            <Grid
              columns={24}
              gutter={0}
              className={`${classes["head-phone"]} ${classes["text-width-two"]}`}
            >
              <Grid.Col span={6}>{t("Mobile")}</Grid.Col>
              <Grid.Col span={2}>:</Grid.Col>
              <Grid.Col span={16}>{configData?.domain?.mobile}</Grid.Col>
            </Grid>
            <Grid
              columns={24}
              gutter={0}
              className={`${classes["head-phone"]} ${classes["text-width-two"]}`}
            >
              <Grid.Col span={6}>{t("Address")}</Grid.Col>
              <Grid.Col span={2}>:</Grid.Col>
              <Grid.Col span={16}>{configData?.address}</Grid.Col>
            </Grid>
            <Grid
              columns={24}
              gutter={0}
              className={`${classes["head-phone"]} ${classes["text-width-two"]}`}
              mb={"xs"}
            >
              <Grid.Col span={6}>{t("SalesBy")}</Grid.Col>
              <Grid.Col span={2}>:</Grid.Col>
              <Grid.Col span={16}>{salesByUserName}</Grid.Col>
            </Grid>
          </div>
        </header>
        <main className={classes["body-main"]}>
          <h3 className={classes["main-title"]}>
            <span className={classes["main-title-span"]}>
              {selectedProducts.type}
            </span>
          </h3>
          <table style={{ width: "78mm" }}>
            <tbody>
              {selectedProducts?.items?.map((element, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td
                      className={`${classes["invoice-text"]} ${classes["text-left"]}`}
                      style={{ width: "30mm" }}
                    >
                      {element.display_name}
                    </td>
                    <td
                      className={`${classes["invoice-text"]} ${classes["text-left"]}`}
                      style={{ width: "6mm" }}
                    >
                      {element.quantity}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      <h3 className={classes["table-title"]}></h3>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <Text
            className={`${classes["footer-company"]} ${classes["invoice-text"]}`}
            mt={"md"}
            mb={0}
          >
            {t("Note")} : {selectedProducts?.note}
          </Text>
        </main>
      </div>
    </>
  );
}
