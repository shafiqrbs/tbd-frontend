import React, { forwardRef } from "react";
import { Tooltip, Select } from "@mantine/core";
import { useDispatch } from "react-redux";
import { storeEntityData } from "../../store/core/crudSlice.js";
import { showNotificationComponent } from "../core-component/showNotificationComponent.jsx";
import inputCss from "../../assets/css/InputField.module.css";

const SelectFormForSalesPurchaseProduct = forwardRef((props, ref) => {
    const {
        position,
        color,
        label,
        placeholder,
        required,
        nextField,
        name,
        form,
        tooltip,
        mt,
        id,
        dropdownValue,
        searchable,
        value,
        changeValue,
        clearable = true,
        allowDeselect = true,
        inlineUpdate = false,
        updateDetails = null,
        size,
        pt,
        disabled = false,
        comboboxProps
    } = props;

    const dispatch = useDispatch();

    const handleChange = async (val) => {
        const selectedOption = dropdownValue.find((opt) => opt.value === val);

        if (changeValue) {
            changeValue(selectedOption || null);
        }

        form.setFieldValue(name, val);

        if (nextField) {
            setTimeout(() => {
                const nextElement = document.getElementById(nextField);
                if (nextElement) {
                    nextElement.focus();
                }
            }, 0);
        }

        if (inlineUpdate && updateDetails) {
            updateDetails.data.value = val;

            try {
                const resultAction = await dispatch(storeEntityData(updateDetails));
                if (resultAction.payload?.status !== 200) {
                    showNotificationComponent(resultAction.payload?.message || "Error updating", "red", "", true);
                }
            } catch (error) {
                showNotificationComponent("Request failed. Please try again.", "red", "", true);
                console.error("Error updating:", error);
            }
        }
    };

    return (
        <>
            {form && (
                <Tooltip
                    label={tooltip}
                    opened={name in form.errors && !!form.errors[name]}
                    px={16}
                    py={2}
                    position={position || "top-end"}
                    bg={color || "red.4"}
                    c="white"
                    withArrow
                    offset={2}
                    zIndex={999}
                    transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                >
                    <Select
                        pt={pt}
                        classNames={inputCss}
                        ref={ref}
                        id={id}
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        size={size || "sm"}
                        data={dropdownValue}
                        autoComplete="off"
                        clearable={clearable}
                        searchable={searchable}
                        value={value?.value || null} // Important: Select wants the string value
                        onChange={handleChange}
                        withAsterisk={required}
                        comboboxProps={comboboxProps || { withinPortal: false }}
                        allowDeselect={allowDeselect}
                        disabled={disabled}
                    />
                </Tooltip>
            )}
        </>
    );
});

export default SelectFormForSalesPurchaseProduct;