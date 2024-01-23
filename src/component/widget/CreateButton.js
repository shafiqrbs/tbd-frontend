import React, { useRef } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {Input, Tooltip, Tabs, Text, HoverCard, Button, Mark, ScrollArea} from '@mantine/core';
import { IconBrandTwitter, IconAlertCircle,IconSpeakerphone } from '@tabler/icons-react';
import { CheckCircleIcon,XMarkIcon } from '@heroicons/react/24/outline'
import { FiRepeat } from "react-icons/fi";
import { Puff } from 'react-loading-icons'
export default function CreateButton() {
    return (
        <Text className="absolute right-0 top-0">

            <div className="inline-flex items-center mr-1 rounded border-grey-dark bg-red-50 hover:bg-red-100 text-gray-400 overflow-hidden">
                <Tooltip label="Back to List Page (Crtl+X)"
                         color="red"
                         position="bottom"
                         withArrow>
                <button  className="text-sm pt-2 pb-2 px-3">
                <XMarkIcon height={20} width={20}></XMarkIcon>
                </button>
                </Tooltip>
            </div>
            <div className="inline-flex items-center mr-1 rounded border-grey-dark bg-yellow-100 hover:bg-yellow-200 text-yellow-600 overflow-hidden">
                <Tooltip label="Click for Reset value (Crtl+R)"
                         color="yellow"
                         position="bottom"
                         withArrow>
                    <button  className="text-sm pt-2 pb-2 px-3">
                        <CheckCircleIcon height={20} width={20}></CheckCircleIcon>
                    </button>
                </Tooltip>
            </div>
            <div className="inline-flex items-center pl-2 gap-x-2 rounded  border-grey-dark bg-blue-500 overflow-hidden">
                <div>
                    <Puff height={20} width={20}></Puff>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm pt-1 pb-2 px-4">
                    Create & Save
                    <span className="block text-mini">Crtl+S</span>
                </button>
            </div>

            {/* <div className="inline-flex items-center pl-2 gap-x-2 rounded border-b-2 text-white border-grey-dark bg-blue-800 overflow-hidden">
                                <div>
                                    <CheckCircleIcon height={20} width={20}></CheckCircleIcon>
                                </div>
                                <button
                                    className="bg-blue-700 hover:bg-blue-800 text-white text-sm pt-1 pb-2 px-6 rounded">
                                    Save
                                    <span className="block text-mini">Crtl+S</span>
                                </button>
                            </div>
*/}
        </Text>
    )
}
