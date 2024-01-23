import React, { useRef } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {Input, Tooltip, Tabs,Box,TabsProps, rem, Text, HoverCard, Button, Mark, ScrollArea} from '@mantine/core';
import { IconBrandTwitter, IconAlertCircle,IconSpeakerphone,IconCheckupList,IconPlus } from '@tabler/icons-react';
import { CheckCircleIcon,XMarkIcon, } from '@heroicons/react/24/outline'
import { SpinningCircles,Bars,Puff } from 'react-loading-icons'
import { IconSettings, IconMessageCircle, IconCoin } from '@tabler/icons-react';
import CreateButton from "../../widget/CreateButton";
import EditButton from "../../widget/EditButton";
import TablePagination from "../../../datatable/TablePagination";
import { IconPhoto } from '@tabler/icons-react';
import TableSettingButton from "../../widget/TableSettingButton";

export default function Example() {
    const containerHeight = localStorage.getItem('containerHeight');
    console.log(containerHeight);
    return (
        <div className="">
            <Tabs defaultValue="first" className="relative mb-12">
                <Tabs.List>
                    <Tabs.Tab icon={<IconCheckupList size="0.8rem" />} value="first">List of Data</Tabs.Tab>
                    <Tabs.Tab icon={<IconPlus size="0.8rem" />} value="second" >
                        Create New
                    </Tabs.Tab>
                    <Tabs.Tab icon={<IconMessageCircle size="0.8rem" />} value="third">Third tab</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="first" pt="xs">
                    <TableSettingButton></TableSettingButton>
                    <Box sx={{height: containerHeight}}>
                        <TablePagination></TablePagination>
                    </Box>
                </Tabs.Panel>
                <Tabs.Panel value="second" pt="xs">
                   <CreateButton></CreateButton>
                    <ScrollArea.Autosize  style={{height:containerHeight}} mx="auto"  scrollbarSize={6}
                                          styles={(theme) => ({
                                              scrollbar: {
                                                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                                                      backgroundColor: theme.colors.blue[6],
                                                  }
                                              }
                                          })}>
                        <div className="mr-8">
                        <div className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                            <h2 className="text-base font-semibold  text-gray-900">Notifications</h2>
                            <p className="mt-1 max-w-2xl text-sm  text-gray-600">
                                We'll always let you know about important changes, but you pick what else you want to hear about.
                            </p>
                        </div>
                        <div className="mt-2 space-y-8 border-b  pb-12 sm:space-y-0  sm:border-t sm:pb-0">
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />

                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-right sm:pt-1.5">
                                    Password
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                            <h2 className="text-base font-semibold  text-gray-900">Notifications</h2>
                            <p className="mt-1 max-w-2xl text-sm  text-gray-600">
                                We'll always let you know about important changes, but you pick what else you want to hear about.
                            </p>
                        </div>
                        <div className="mt-10 space-y-8 border-b  pb-12 sm:space-y-0  sm:border-t sm:pb-0">
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />





                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                                <label htmlFor="username" className="block sm:col-span-2 text-sm font-medium text-gray-900 text-right sm:pt-1.5">
                                    Username
                                </label>
                                <div className="mt-2 sm:col-span-4 sm:mt-0 relative">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                        error={"error123432"}
                                    />

                                    {/*<Text className="bg-red-400 absolute p-1">Error</Text>*/}
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-right sm:pt-1.5">
                                    Password
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <Input
                                        icon={<IconBrandTwitter size="1rem" />}
                                        placeholder="Your twitter"
                                        size="xs"
                                        rightSection={
                                            <Tooltip label="This is public" position="top-end" withArrow>
                                                <div>
                                                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                            </div>

                        </div>
                        </div>
                    </ScrollArea.Autosize>
                </Tabs.Panel>
                <Tabs.Panel value="third" pt="xs">
                    <EditButton></EditButton>
                    <ScrollArea.Autosize  style={{height:containerHeight}} mx="auto"  scrollbarSize={6}
                                          styles={(theme) => ({
                                              scrollbar: {
                                                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                                                      backgroundColor: theme.colors.blue[6],
                                                  }
                                              }
                                          })}>
                       <div className="mr-4">

                           <body class="flex items-center justify-center">
                           <div class="container">
                               <table class="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5">
                                   <thead class="text-white">
                                   <tr class="bg-teal-400 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                                       <th class="p-3 text-left">Name</th>
                                       <th class="p-3 text-left">Email</th>
                                       <th class="p-3 text-left" width="110px">Actions</th>
                                   </tr>
                                   <tr class="bg-teal-400 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                                       <th class="p-3 text-left">Name</th>
                                       <th class="p-3 text-left">Email</th>
                                       <th class="p-3 text-left" width="110px">Actions</th>
                                   </tr>
                                   <tr class="bg-teal-400 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                                       <th class="p-3 text-left">Name</th>
                                       <th class="p-3 text-left">Email</th>
                                       <th class="p-3 text-left" width="110px">Actions</th>
                                   </tr>
                                   <tr class="bg-teal-400 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                                       <th class="p-3 text-left">Name</th>
                                       <th class="p-3 text-left">Email</th>
                                       <th class="p-3 text-left" width="110px">Actions</th>
                                   </tr>
                                   </thead>
                                   <tbody class="flex-1 sm:flex-none">
                                   <tr class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
                                       <td class="border-grey-light border hover:bg-gray-100 p-3">John Covv</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">contato@johncovv.com</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</td>
                                   </tr>
                                   <tr class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
                                       <td class="border-grey-light border hover:bg-gray-100 p-3">Michael Jackson</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">m_jackson@mail.com</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</td>
                                   </tr>
                                   <tr class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
                                       <td class="border-grey-light border hover:bg-gray-100 p-3">Julia</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">julia@mail.com</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</td>
                                   </tr>
                                   <tr class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
                                       <td class="border-grey-light border hover:bg-gray-100 p-3">Martin Madrazo</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">martin.madrazo@mail.com</td>
                                       <td class="border-grey-light border hover:bg-gray-100 p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</td>
                                   </tr>
                                   </tbody>
                               </table>
                           </div>
                           </body>
                       </div>
                    </ScrollArea.Autosize>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}
