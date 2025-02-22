import React, { forwardRef } from "react";
import { Tooltip, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";

const SelectServerSideForm = forwardRef((props, ref) => {
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
      searchValue,
      setSearchValue,
      disabled
    } = props;
  
    const handleChange = (e) => {
      form.setFieldValue(name, e);
      if (nextField) {
        // Small delay to ensure the Select's internal state is updated
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
            px={20}
            py={3}
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
              searchValue={searchValue}
              onSearchChange={(e) => setSearchValue(e)}
              data={dropdownValue}
              clearable
              searchable={searchable}
              {...form.getInputProps(name)}
              onChange={handleChange}
              withAsterisk={required}
              disabled={disabled}
            />
          </Tooltip>
        )}
      </>
    );
  });

export default SelectServerSideForm;
