import React, { forwardRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Box, Tooltip, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from "react-i18next";

const TooltipContent = forwardRef(({ onClick, onMouseEnter, onMouseLeave }, ref) => (
    <div
        ref={ref}
        style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <IconInfoCircle size={16} opacity={0.5} />
    </div>
));

export default function PhoneNumber(props) {
    const { name, form, tooltip, mt, id, disabled, label, placeholder, required, nextField } = props;
    const { t } = useTranslation();
    const error = form.errors[name];

    const handleChange = (value) => {
        form.setFieldValue(name, value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (nextField === 'EntityFormSubmit') {
                document.getElementById(nextField).click();
            } else {
                document.getElementById(nextField)?.focus();
            }
        }
    };

    return (
        <Box mt={mt}>
            <Text size="sm" fw={500} mb={3}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </Text>
            <Tooltip
                label={tooltip}
                opened={(name in form.errors) && !!form.errors[name]}
                px={20}
                py={3}
                position="top-end"
                color='red'
                withArrow
                offset={2}
                transitionProps={{ transition: 'pop-bottom-left', duration: 500 }}
            >
                <div style={{ position: 'relative' }}>
                    <PhoneInput
                        country={'bd'}
                        value={form.values[name]}
                        onChange={handleChange}
                        inputProps={{
                            required: required,
                            disabled: disabled,
                            id: id,
                            onKeyDown: handleKeyDown,
                        }}
                        inputStyle={{
                            width: '100%',
                            height: '36px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            borderColor: error ? 'red' : undefined,
                            paddingRight: '2.5rem',
                        }}
                        containerStyle={{ marginBottom: 0 }}
                        placeholder={placeholder}
                    />

                    <div style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}>
                        <Tooltip
                            label={tooltip}
                            px={16}
                            py={2}
                            withArrow
                            position="left"
                            c='black'
                            bg='gray.1'
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <TooltipContent />
                        </Tooltip>
                    </div>
                </div>
            </Tooltip>
        </Box>
    );
}