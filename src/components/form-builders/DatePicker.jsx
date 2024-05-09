import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateInput } from '@mantine/dates';


dayjs.extend(customParseFormat);

function DatePickerForm(props) {
    const {
        format,
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
        base,
        sm,
        lg
    } = props
    return (
        <>
            <DateInput
                valueFormat="DD/MM/YYYY"
                label={label}
                placeholder={placeholder}
            />
        </>
    );
}

export default DatePickerForm;