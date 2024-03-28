import { UnstyledButton, Checkbox, Text, Image, SimpleGrid } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import {
    IconCheck,
    IconDeviceFloppy,
    IconInfoCircle,
    IconPlus,
    IconUserCog,
    IconStackPush,
    IconPrinter,
    IconReceipt,
    IconPercentage,
    IconCurrencyTaka,
    IconRestore,
    IconPhoto,
    IconMessage,
    IconEyeEdit,
    IconRowRemove,
    IconTrash,
    IconX,
    IconWallet,
    IconDeviceMobileDollar,
    IconBuildingBank, IconUserCircle, IconRefreshDot,

} from "@tabler/icons-react";
import genericCss from '../../assets/css/ImageRadioBox.module.css';


const mockdata = [
    { description: 'Sun and sea', title: 'Beach vacation', image: icons.sea },
    { description: 'Sightseeing', title: 'City trips', image: icons.city },
    { description: 'Mountains', title: 'Hiking vacation', image: icons.mountain },
    { description: 'Snow and ice', title: 'Winter vacation', image: icons.winter },
];

export function ImageCheckboxes() {
    <>
        <Box>Radio Button</Box>
    </>
}