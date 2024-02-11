import React, {useEffect, useRef, useState} from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    Group,
    Tabs,
    rem,
    Text,
    Tooltip,
    Box,
    ScrollArea,
    Flex,
    Title,
    Grid,
    TextInput, SimpleGrid, ActionIcon, List, ColorInput, Autocomplete, MultiSelect, Select,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import {
    IconCircle,
    IconCircleCheck,
    IconColorFilter,
    IconCross, IconEdit, IconEye,
    IconList,
    IconPlaylistAdd, IconSearch,
    IconSettings, IconTrash,
    IconX, IconFilter, IconEyeSearch,
    IconXboxX, IconUserCircle, IconInfoCircle,
} from "@tabler/icons-react";
import {getHotkeyHandler, useViewportSize} from "@mantine/hooks";

import {DataTable} from "mantine-datatable";
import {hasLength, isEmail, isInRange, isNotEmpty, matches, useForm} from "@mantine/form";
import axios from "axios";
const PAGE_SIZE = 20;




function ThreeGrid(props) {
    const {t, i18n} = useTranslation();
    const {isFormSubmit,setFormSubmit,setFormSubmitData,form} = props


    const [saveFormData, setSaveFormData] = useState(null);
  const [page,setPage] = useState(1)
  const [fetching,setFetching] = useState(true)
  const [showItemDetails,setShowItemDetails] = useState(false)
  const [showItemData,setShowItemData] = useState(false)





 /* const onSubmitForm=(e)=>{
      e.preventDefault();
      console.log('Error');
      document.getElementById('submitForm').submit()
  }*/


    // console.log(isFormSubmit)
    // console.log('ok')
  /*  if (isFormSubmit == true){
        setFormSubmit(false)
        onSubmitForm('ok')
    }*/

    // console.log(form.values)

  const [records, setRecords] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: "https://jsonplaceholder.typicode.com/users",
    })
        .then(function (res) {
          setRecords(res.data);
          setFetching(false)
        })
        .catch(function (error) {
          console.log(error);
        });
  }, []);

    // console.log(records)

  const [value, setValue] = useState("I've just used a hotkey to send a message");




  return (
    <>
      <Box>


        <SimpleGrid cols={3}>
          <div>
            <Box p={`md`}>
                  <Group right={0} gap={0}>
                      <TextInput
                          leftSection={<IconUserCircle size={16} opacity={0.5} />}
                          rightSection={
                              <Tooltip
                                  label={t("this_filed_is_required")}
                                  withArrow
                                  bg={`blue.5`}
                              >
                                  <IconInfoCircle size={16} opacity={0.5} />
                              </Tooltip>
                          }
                          size="sm"
                          placeholder={t('EnterSearchAnyKeyword')}
                      />

                      <Tooltip
                          label={t('ClickHereForListOfRows')}
                          px={20}
                          py={3}
                          color={`blue.3`}
                          withArrow
                          position={"bottom"}
                          transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                      >
                          <Button size="sm" color={`blue.5`} variant="light" ml={4} mr={2}>
                              <IconEyeSearch size={18} />
                          </Button>
                      </Tooltip>
                      <Tooltip
                          label={t("ClickHereForFilterWithAdvanceSearch")}
                          px={20}
                          py={3}
                          color={`green.3`}
                          withArrow
                          position={"bottom"}
                          transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                      >
                          <Button size="sm" variant="light" color={`green.5`}>
                              <IconFilter size={18} />
                          </Button>
                      </Tooltip>

                  </Group>
            </Box>


            <Box h={1} bg={`gray.1`}></Box>

              <ScrollArea style={{ height: '500px' }}>

              {/*<Box sx={{height: '100px',width:'100px'}}>*/}
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
                                    onClick={() => {
                                        setShowItemDetails(true)
                                        setShowItemData(record)
                                    }}
                                >
                                    <IconEye size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="blue"
                                      onClick={() => {
                                          console.log('ok')
                                      }}
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
                totalRecords={200}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => {
                    setPage(p)
                    setFetching(true)
                }}
                fetching={fetching}
                loaderSize="xs"
                loadercolor="blue"
                loaderBackgroundBlur={1}
                // sortStatus={sortStatus}
                // onSortStatusChange={(e)=> dispatch(setSortStatus(e))}
            />
              {/*</Box>*/}
              </ScrollArea>
          </div>
          <div>
            <Box p={`xs`}>
              <Title order={4}>Details Data</Title>
              <Text fz={`sm`}>We'll always let you know about important changes</Text>
            </Box>
            <Box h={1} bg={`gray.1`}></Box>

              <ScrollArea style={{ height: '500px' }}>
                  {
                      showItemDetails &&
                      <List>
                          <List.Item>{showItemData.name}</List.Item>
                          <List.Item>{showItemData.username}</List.Item>
                          <List.Item>{showItemData.email}</List.Item>
                          <List.Item>{showItemData.phone}</List.Item>
                          <List.Item>{showItemData.website}</List.Item>
                      </List>
                  }
              </ScrollArea>
          </div>
          <div className={"form-box"}>


            <Box p={`xs`}>
              <Title order={4}>Form</Title>
              <Text fz={`sm`}>We'll always let you know about important changes</Text>
            </Box>
            <Box h={1} bg={`gray.1`}></Box>


              <Box p={`sm`}>

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
                      size="sm"
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
              <Tooltip
                  label={"Invalid Email"}
                  opened={!!form.errors.email}
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
                      size="sm"
                      id="email"
                      mt={8}
                      label="Your email"
                      placeholder="Your email"
                      withAsterisk
                      {...form.getInputProps("email")}
                      onKeyDown={getHotkeyHandler([
                          ['Enter', (e)=>{
                              document.getElementById('favoriteColor').focus();
                          }],
                      ])}
                  />
              </Tooltip>

              <Tooltip
                  label={"Enter a valid hex color"}
                  opened={!!form.errors.favoriteColor}
                  px={20}
                  py={3}
                  position="top-end"
                  color="red"
                  withArrow
                  offset={2}
                  zIndex={0}
                  transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
              >
                  <ColorInput
                      size="sm"
                      label="Your favorite color"
                      id="favoriteColor"
                      mt={8}
                      onKeyDown={getHotkeyHandler([
                          ['Enter', (e)=>{
                              document.getElementById('programming').focus()
                          }],
                      ])}
                      // placeholder="Your favorite color"
                      withAsterisk
                      {...form.getInputProps("favoriteColor")}
                  />
              </Tooltip>

              <Tooltip
                  label={"Require"}
                  opened={!!form.errors.select}
                  px={20}
                  py={3}
                  position="top-end"
                  color="red"
                  withArrow
                  offset={2}
                  zIndex={0}
                  transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
              >
                  <Select
                      id="programming"
                      label={"select"}
                      size="sm"
                      mt={8}
                      data={["React", "Angular", "Vue", "Svelte"]}

                      clearable
                      withAsterisk
                      {...form.getInputProps("select")}
                  />
              </Tooltip>
              </Box>
          </div>
        </SimpleGrid>



      </Box>
      </>
  );
}

export default ThreeGrid;
