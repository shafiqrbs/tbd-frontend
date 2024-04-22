import React, { useEffect, useState } from "react";
import { Box, Progress, TextInput, List } from "@mantine/core";

const initialItems = [
    '🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate',
    '🤽‍♂️ WaterPolo', '🍅 Tomato', '🥒 Cucumber', '🍋 Lemon', '🇬🇹 Guatemala'

];

function SearchModal() {
    const [items, setItems] = useState(initialItems);
    const [filteredItems, setFilteredItems] = useState(initialItems);

    const filterList = (event) => {
        const updatedList = initialItems.filter(item =>
            item.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredItems(updatedList);
    };

    useEffect(() => {
        setFilteredItems(initialItems);
    }, []);

    const onItemClick = (item) => {
        // Handle click event here, you can do anything with the clicked item
        console.log("Item clicked:", item);
    };

    return (
        <Box>
            <TextInput
                placeholder="Search"
                onChange={filterList}
            />
            <Box style={{
                border: '1px solid #ddd',
                overflowY: 'auto',
                maxHeight: '300px', // Adjust the max height as needed
            }} mt={8}>
                <List>
                    {filteredItems.map(item => (

                        <List.Item
                            m={'md'}
                            styles={{
                                borderBottom: '1px solid #ddd',
                                padding: '12px',
                                cursor: 'pointer'
                            }}
                            key={item}
                            onClick={() => onItemClick(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item}
                        </List.Item>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default SearchModal;