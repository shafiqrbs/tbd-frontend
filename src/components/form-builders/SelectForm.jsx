import React, { forwardRef } from "react";
import {
    Tooltip,
    Select
} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";

const SelectForm = forwardRef((props, ref) => {
    const {
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
      allowDeselect = true
    } = props;
  
    const handleChange = (e) => {
      changeValue(e);
      form.setFieldValue(name, e);
      if (nextField) {
        setTimeout(() => {
          const nextElement = document.getElementById(nextField);
          if (nextElement) {
            nextElement.focus();
          }
        }, 0);
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
            position="top-end"
            bg="red.4"
            c="white"
            withArrow
            offset={2}
            zIndex={999}
            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
          >
            <Select
              ref={ref}
              id={id}
              label={label}
              placeholder={placeholder}
              mt={mt}
              size="sm"
              data={dropdownValue}
              autoComplete="off"
              clearable={clearable}
              searchable={searchable}
              {...form.getInputProps(name)}
              value={value}
              onChange={handleChange}
              withAsterisk={required}
              comboboxProps={props.comboboxProps}
              allowDeselect={allowDeselect}
            />
          </Tooltip>
        )}
      </>
    );
  });

  export default SelectForm
