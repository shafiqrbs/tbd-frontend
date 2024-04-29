import React, { useState } from "react";
import {
    Tooltip,
    Select, SimpleGrid, Text, Image, Flex, Center
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

function ImageUploadDropzone(props) {
    const {
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

    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image maw={240} mx="auto" radius="md" key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />);
    });

    return (
        <>
            <div>
                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
                    <Text ta="center">{placeholder}</Text>
                </Dropzone>

                <Center mt={previews.length > 0 ? 'xl' : 0}>
                    <div>
                        <SimpleGrid cols={{ base: 1, sm: 1, lg: 1 }}>
                            {previews}
                        </SimpleGrid>

                    </div>
                </Center>
            </div>
        </>
    );
}

export default ImageUploadDropzone;
