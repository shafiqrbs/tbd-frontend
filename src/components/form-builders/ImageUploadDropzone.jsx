import React, {useState} from "react";
import {
    Tooltip,
    Select, SimpleGrid,Text,Image
} from "@mantine/core";
import {getHotkeyHandler} from "@mantine/hooks";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";

function ImageUploadDropzone(props) {
    /*const {
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
        changeValue
    } = props*/

    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });

    return (
        <>
            <div>
                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
                    <Text ta="center">Drop images here</Text>
                </Dropzone>

                <SimpleGrid cols={{base: 1, sm: 4}} mt={previews.length > 0 ? 'xl' : 0}>
                    {previews}
                </SimpleGrid>
            </div>
        </>
    );
}

export default ImageUploadDropzone;
