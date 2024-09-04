import React from "react";
import {
    SimpleGrid, Text, Image, Center
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

function ImageUploadDropzone(props) {
    const {
        placeholder,
        files,
        setFiles,
        existsFile
    } = props


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
                            {files[0] ? previews :
                                <>
                                    <Image
                                        mb={'4'}
                                        mt={'xs'}
                                        maw={240}
                                        key={0}
                                        mx="auto"
                                        radius="md"
                                        src={existsFile}
                                        onLoad={() => URL.revokeObjectURL(existsFile)} />
                                </>
                            }
                        </SimpleGrid>

                    </div>
                </Center>
            </div>
        </>
    );
}

export default ImageUploadDropzone;
