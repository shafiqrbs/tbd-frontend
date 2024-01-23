import React, { useRef } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {Input, Tooltip, Tabs, Text, HoverCard, Button, Mark, ScrollArea, Menu} from '@mantine/core';
import { IconBrandTwitter, IconAlertCircle,IconSpeakerphone,IconColorFilter,IconCsv,IconPdf } from '@tabler/icons-react';
import { CheckCircleIcon,XMarkIcon } from '@heroicons/react/24/outline'
import {HiOutlineFilter } from 'react-icons/hi'
import { Puff } from 'react-loading-icons'
export default function TableSettingButton() {
    return (
        <Text className="absolute right-0 top-0">
            <Tooltip label="Click Setting Navigation"
                     color="red"
                     position="bottom"
                     withArrow>
            <button
                className="bg-red-600 hover:bg-red-700 text-white text-sm pt-1 pb-2 px-4 mr-1 rounded">
                <IconColorFilter height={20} width={20}></IconColorFilter>
            </button>
            </Tooltip>
            <Tooltip label="Click Setting Navigation"
                     color="green"
                     position="bottom"
                     withArrow>
            <button
                className="bg-green-600 hover:bg-green-700 text-white text-sm pt-1 pb-2 mr-1 px-4 rounded">
                <IconCsv height={20} width={20}></IconCsv>
            </button>
            </Tooltip>
            <Tooltip label="Click Setting Navigation"
                     color="blue"
                     position="bottom"
                     withArrow>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm pt-1 pb-2 px-4 rounded">
                <IconPdf height={20} width={20}></IconPdf>
            </button>
            </Tooltip>
        </Text>
    )
}
