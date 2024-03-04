import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Tooltip, TextInput, Switch, Group, Text, LoadingOverlay, Modal, ActionIcon,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconFilter,
    IconInfoCircle,
    IconPlus,
    IconRestore,
    IconSearch,
    IconX,
    IconXboxX
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useHotkeys} from "@mantine/hooks";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {setFetching, setSearchKeyword, storeEntityData, updateEntityData} from "../../../store/core/crudSlice.js";
function KeywordSearch() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline} = useOutletContext();
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );
    return (
        <>
            <Grid justify="flex-end" align="flex-end">
                <Grid.Col span={10}>
                    <Tooltip
                        label={t('EnterSearchAnyKeyword')}
                        opened={searchKeywordTooltip}
                        px={16}
                        py={2}
                        position="top-end"
                        color="red"
                        withArrow
                        offset={2}
                        zIndex={100}
                        transitionProps={{transition: "pop-bottom-left", duration: 5000}}
                    >
                        <TextInput
                            leftSection={<IconSearch size={16} opacity={0.5}/>}
                            size="sm"
                            placeholder={t('EnterSearchAnyKeyword')}
                            onChange={(e) => {
                                dispatch(setSearchKeyword(e.currentTarget.value))
                                e.target.value !== '' ?
                                    setSearchKeywordTooltip(false) :
                                    (setSearchKeywordTooltip(true),
                                        setTimeout(() => {
                                            setSearchKeywordTooltip(false)
                                        }, 1000))
                            }}
                            value={searchKeyword}
                            id={'SearchKeyword'}
                            rightSection={
                                searchKeyword ?
                                    <Tooltip
                                        label={t("Close")}
                                        withArrow
                                        bg={`red.5`}
                                    >
                                        <IconX color={`red`} size={16} opacity={0.5} onClick={() => {
                                            dispatch(setSearchKeyword(''))
                                        }}/>
                                    </Tooltip>
                                    :
                                    <Tooltip
                                        label={t("FiledIsRequired")}
                                        withArrow
                                        position={"bottom"}
                                        c={'indigo'}
                                        bg={`indigo.1`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                            }
                        />
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={2}>
                    <ActionIcon.Group mt={'1'}>
                        <ActionIcon variant="transparent" size="lg" mr={16} aria-label="Gallery"
                                    onClick={() => {
                                        searchKeyword.length > 0 ?
                                            (dispatch(setFetching(true)),
                                                setSearchKeywordTooltip(false))
                                            :
                                            (setSearchKeywordTooltip(true),
                                                setTimeout(() => {
                                                    setSearchKeywordTooltip(false)
                                                }, 1500))
                                    }}
                        >
                            <Tooltip
                                label={t('SearchButton')}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'indigo'}
                                bg={`gray.1`}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconSearch  style={{ width: rem(20) }} stroke={2.0} />
                            </Tooltip>
                        </ActionIcon>

                        <ActionIcon variant="transparent" size="lg"  mr={16} aria-label="Settings">
                            <Tooltip
                                label={t("FilterButton")}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'indigo'}
                                bg={`gray.1`}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconFilter style={{ width: rem(20) }} stroke={2.0} />
                            </Tooltip>
                        </ActionIcon>
                        <ActionIcon variant="transparent" size="lg" aria-label="Settings">
                            <Tooltip
                                label={t("ResetButton")}
                                px={16}
                                py={2}
                                withArrow
                                position={"bottom"}
                                c={'indigo'}
                                bg={`gray.1`}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <IconRestore style={{ width: rem(20) }} stroke={2.0} onClick={()=> {
                                    dispatch(setSearchKeyword(''))
                                    dispatch(setFetching(true))
                                }} />
                            </Tooltip>
                        </ActionIcon>
                    </ActionIcon.Group>
                </Grid.Col>
            </Grid>
        </>
    );
}

export default KeywordSearch;
