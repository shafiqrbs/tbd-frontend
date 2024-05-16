import React from "react";
import {
    Tooltip,
    Select
} from "@mantine/core";
import {useTranslation} from "react-i18next";

function SelectServerSideForm(props) {
    const {label,placeholder,required,name,form,tooltip,mt,id,dropdownValue,searchable,searchValue,setSearchValue} = props
    const {t, i18n} = useTranslation();
    return (
        <>
            {
                form &&
                <Tooltip
                    label={tooltip}
                    opened={ (name in form.errors) && !!form.errors[name]}
                    px={20}
                    py={3}
                    position="top-end"
                    bg={`red.4`}
                    c={'white'}
                    withArrow
                    offset={2}
                    zIndex={0}
                    transitionProps={{transition: "pop-bottom-left", duration: 500}}
                >
                    <Select
                        id={id}
                        label={label}
                        placeholder={placeholder}
                        mt={mt}
                        size="sm"
                        searchValue={searchValue}
                        onSearchChange={(e)=>{
                            setSearchValue(e)
                        }}
                        data={dropdownValue}
                        clearable
                        searchable={searchable}
                        {...form.getInputProps(name)}
                        withAsterisk={required}
                    />
                </Tooltip>

                }
            </>
    );
}

export default SelectServerSideForm;
