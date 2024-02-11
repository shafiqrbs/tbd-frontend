import React, {useCallback, useEffect, useState} from "react";
import ReactShortcut from 'react-shortcut';

import {
  useForm,
  isNotEmpty,
  isEmail,
  isInRange,
  hasLength,
  matches,
} from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  NumberInput,
  Box,
  Tooltip,
  ColorInput,
  Checkbox,
  Grid,
  Switch,
  Flex,
  Textarea,
  Autocomplete,
  MultiSelect,
  Select,
  rem,
  Text,
  Radio,
  ScrollArea,
  Center, Table, SimpleGrid, ActionIcon,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {IconEdit, IconEye, IconPhoto, IconSearch, IconTrash, IconUpload, IconX} from "@tabler/icons-react";
import {
  DateInput,
  DatePickerInput,
  DateTimePicker,
  DatesProvider,
  MonthPickerInput,
} from "@mantine/dates";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import { notifications } from '@mantine/notifications';
import { getHotkeyHandler } from '@mantine/hooks';
import {DataTable} from "mantine-datatable";
import axios from "axios";
// import companies from 'company.json';

// console.log(companies)

function CrudForm() {


  const [saveFormData, setSaveFormData] = useState(null);
  const form = useForm({
    initialValues: {},

    validate: {
      name: hasLength({ min: 2, max: 10 }),
      // job: isNotEmpty('Enter your current job'),
      email: isEmail(),
      favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/),
      age: isInRange({ min: 18, max: 99 }),
      agree: isNotEmpty(),
      switch: isNotEmpty(),
      radio: isNotEmpty(),
      textarea: isNotEmpty(),
      autocomplete: isNotEmpty(),
      multiselect: isNotEmpty(),
      select: isNotEmpty(),
      date_input: isNotEmpty(),
      month_picker: isNotEmpty(),
      date_picker: isNotEmpty(),
      date_time_picker: isNotEmpty(),
      file: isNotEmpty(),
    },
  });

  const [records, setRecords] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: "https://jsonplaceholder.typicode.com/users",
    })
        .then(function (res) {
          setRecords(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
  }, []);

  const [value, setValue] = useState("I've just used a hotkey to send a message");


  // const handleSubmit = () => notifications.show({ title: 'Your message', message: value });

  return (



    <Box
      component="form"
      onSubmit={form.onSubmit((values) => setSaveFormData(values))}
    >


      <SimpleGrid cols={3}>
        <div>
          <DataTable
              records={records}
              columns={[
                {
                  accessor: "id",
                  filter: (
                      <TextInput
                          label="Employees"
                          description="Show employees whose names include the specified text"
                          placeholder="Search employees..."
                          leftSection={<IconSearch size={16} />}
                      />
                  ),
                },

                { accessor: "email" },

                {
                  accessor: "actions",
                  textAlign: "right",
                  render: (record) => (
                      <Group gap={4} justify="right" wrap="nowrap">
                        <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="green"
                            //   onClick={() => showModal({ company, action: 'view' })}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="blue"
                            //   onClick={() => showModal({ company, action: 'edit' })}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="red"
                            //   onClick={() => showModal({ company, action: 'delete' })}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                  ),
                },
              ]}

              // columns={[{ accessor: 'name' }, { accessor: 'streetAddress' }, { accessor: 'city' }, { accessor: 'state' }]}
              // records={companies}
          />
        </div>
        <div>

        </div>
        <div>
          <Tooltip
              label={"Name must be 2-10 characters long"}
              opened={!!form.errors.name}
              px={20}
              py={3}
              position="top-end"
              color="red"
              withArrow
              offset={2}
              zIndex={0}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
          >

            <TextInput
                size="xs"
                label="Name"
                placeholder="Name y"
                withAsterisk
                {...form.getInputProps("name")}
                // value={value}
                // onChange={(event) => setValue(event.target.value)}
                onKeyDown={getHotkeyHandler([
                  ['Enter', (e)=>{
                    document.getElementById('email').focus();
                  }],
                  // ['mod+S', handleSave],
                ])}
            />
          </Tooltip>
        </div>
      </SimpleGrid>
    </Box>
  );
}

export default CrudForm;
