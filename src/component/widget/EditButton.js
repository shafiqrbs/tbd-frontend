import React, { useRef } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {Input, Tooltip, Tabs, Text, HoverCard, Button, Mark, ScrollArea} from '@mantine/core';
import { IconBrandTwitter, IconAlertCircle,IconSpeakerphone } from '@tabler/icons-react';
import { CheckCircleIcon,XMarkIcon, } from '@heroicons/react/24/outline'
import { Puff } from 'react-loading-icons'
export default function EditButton() {
    return (
        <Text className="absolute right-0 top-0">
            <button
                type="button"
                className="inline-flex items-center gap-x-2 mr-2 bg-gray-100 hover:bg-gray-200 text-gray-400 text-sm py-2 px-6 rounded"
            >
                <XMarkIcon className="-ml-0.5 h-5 w-5 " aria-hidden="true" />
                Cancel
            </button>
            <div className="inline-flex items-center pl-2 gap-x-2 rounded border-b-2 border-grey-dark bg-blue-500 overflow-hidden">
                <div>
                    <Puff height={20} width={20}></Puff>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm pt-1 pb-2 px-4 rounded">
                    Edit & Save
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
