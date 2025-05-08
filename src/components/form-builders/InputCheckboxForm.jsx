import React from "react";
import { Grid, Checkbox, Box } from "@mantine/core";
import { useTranslation } from "react-i18next";

function InputCheckboxForm({ label, field, form, mt = "xs" }) {
    const { t } = useTranslation();

    const handleToggle = () => {
        form.setFieldValue(field, form.values[field] === 1 ? 0 : 1);
    };

    return (
        <Box mt={mt}>
            <Grid
                align="center"
                gutter={{ base: 1 }}
                style={{ cursor: "pointer" }}
                onClick={handleToggle}
            >
                <Grid.Col span={11} fz="sm" pt={1}>
                    {t(label)}
                </Grid.Col>
                <Grid.Col span={1}>
                    <Checkbox
                        pr="xs"
                        checked={form.values[field] === 1}
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleToggle}
                        color="red"
                        styles={{ input: { borderColor: "red" } }}
                    />
                </Grid.Col>
            </Grid>
        </Box>
    );
}

export default InputCheckboxForm;
