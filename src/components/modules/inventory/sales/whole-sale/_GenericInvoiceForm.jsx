import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, Flex, ActionIcon, TextInput,
    Grid, Box, Group, Text,
    Tooltip
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconDeviceFloppy, IconPercentage, IconSum, IconCurrency, IconX, IconBarcode, IconCoinMonero, IconSortAscendingNumbers, IconPlusMinus,
    IconPlus
} from "@tabler/icons-react";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import SelectServerSideForm from "../../../../form-builders/SelectServerSideForm.jsx";
import InputButtonForm from "../../../../form-builders/InputButtonForm";
import InputNumberForm from "../../../../form-builders/InputNumberForm";
// import __SalesForm from "../../__SalesForm.jsx";
import { DataTable } from "mantine-datatable";
import _ShortcutInvoice from "../../../shortcut/_ShortcutInvoice";
import tableCss from "../../../../../assets/css/Table.module.css";
import productsDataStoreIntoLocalStorage from "../../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";
// import AddProductDrawer from "../../drawer-form/AddProductDrawer.jsx";

function _GenericInvoiceForm(props) {
    const { currencySymbol, allowZeroPercentage, domainId, isSMSActive, isZeroReceiveAllow, focusFrom } = props
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 170; //TabList height 104
    const [fetching, setFetching] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)

    const [productDrawer, setProductDrawer] = useState(false)

    let salesSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;
    let totalPurchaseAmount = tempCardProducts?.reduce((total, item) => total + (item.purchase_price * item.quantity), 0) || 0;

    const [stockProductRestore, setStockProductRestore] = useState(false)
    useEffect(() => {
        if (stockProductRestore) {
            const local = productsDataStoreIntoLocalStorage()
        }
    }, [stockProductRestore])

    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    }, [loadCardProducts])

    useEffect(() => {
        if (searchValue.length > 0) {
            const storedProducts = localStorage.getItem('core-products');
            const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
            const lowerCaseSearchTerm = searchValue.toLowerCase();
            const fieldsToSearch = ['product_name'];
            const productFilterData = localProducts.filter(product =>
                fieldsToSearch.some(field =>
                    product[field] && String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
                )
            );
            const formattedProductData = productFilterData.map(type => ({
                label: type.product_name, value: String(type.id)
            }));

            setProductDropdown(formattedProductData);
        } else {
            setProductDropdown([]);
        }
    }, [searchValue]);

    function handleAddProductByProductId(values, myCardProducts, localProducts) {
        const addProducts = localProducts.reduce((acc, product) => {
            if (product.id === Number(values.product_id)) {
                acc.push({
                    product_id: product.id,
                    display_name: product.display_name,
                    sales_price: values.sales_price,
                    price: values.price,
                    percent: values.percent,
                    stock: product.quantity,
                    quantity: values.quantity,
                    unit_name: product.unit_name,
                    purchase_price: product.purchase_price,
                    sub_total: selectProductDetails.sub_total,
                    unit_id: product.unit_id,
                });
            }
            return acc;
        }, myCardProducts);

        updateLocalStorageAndResetForm(addProducts);
    }

    function handleAddProductByBarcode(values, myCardProducts, localProducts) {
        const barcodeExists = localProducts.some(product => product.barcode === values.barcode);

        if (barcodeExists) {
            const addProducts = localProducts.reduce((acc, product) => {
                if (String(product.barcode) === String(values.barcode)) {
                    acc.push(createProductFromValues(product));
                }
                return acc;
            }, myCardProducts);

            updateLocalStorageAndResetForm(addProducts);
        } else {
            notifications.show({
                loading: true,
                color: 'red',
                title: 'Product not found with this barcode',
                message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                autoClose: 1000,
                withCloseButton: true,
            });
        }
    }

    function updateLocalStorageAndResetForm(addProducts) {
        localStorage.setItem('temp-sales-products', JSON.stringify(addProducts));
        setSearchValue('');
        form.reset();
        setLoadCardProducts(true);
        document.getElementById('product_id').focus();
    }

    function createProductFromValues(product) {
        return {
            product_id: product.id,
            display_name: product.display_name,
            sales_price: product.sales_price,
            price: product.sales_price,
            percent: '',
            stock: product.quantity,
            quantity: 1,
            unit_name: product.unit_name,
            purchase_price: product.purchase_price,
            sub_total: product.sales_price,
            unit_id: product.unit_id,
        };
    }

    const form = useForm({
        initialValues: {
            product_id: '', price: '', sales_price: '', percent: '', barcode: '', sub_total: '', quantity: ''
        },
        validate: {
            product_id: (value, values) => {
                const isDigitsOnly = /^\d+$/.test(value);
                if (!isDigitsOnly && values.product_id) {
                    return true;
                }
                return null;
            },
            quantity: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            percent: (value, values) => {
                if (value && values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            sales_price: (value, values) => {
                if (values.product_id) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            }
        }
    });

    const [selectProductDetails, setSelectProductDetails] = useState('')

    useEffect(() => {
        const storedProducts = localStorage.getItem('core-products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        const filteredProducts = localProducts.filter(product => product.id === Number(form.values.product_id));

        if (filteredProducts.length > 0) {
            const selectedProduct = filteredProducts[0];

            setSelectProductDetails(selectedProduct);

            form.setFieldValue('price', selectedProduct.sales_price);
            form.setFieldValue('sales_price', selectedProduct.sales_price);
            document.getElementById('quantity').focus();
        } else {
            setSelectProductDetails(null);
            form.setFieldValue('price', '');
            form.setFieldValue('sales_price', '');
        }
    }, [form.values.product_id]);

    useEffect(() => {
        const quantity = Number(form.values.quantity);
        const salesPrice = Number(form.values.sales_price);

        if (!isNaN(quantity) && !isNaN(salesPrice) && quantity > 0 && salesPrice >= 0) {
            if (!allowZeroPercentage) {
                showNotification({
                    color: 'pink',
                    title: t('WeNotifyYouThat'),
                    message: t('ZeroQuantityNotAllow'),
                    autoClose: 1500,
                    loading: true,
                    withCloseButton: true,
                    position: 'top-center',
                    style: { backgroundColor: 'mistyrose' },
                });
            } else {
                setSelectProductDetails(prevDetails => ({
                    ...prevDetails,
                    sub_total: quantity * salesPrice,
                    sales_price: salesPrice,
                }));
                form.setFieldValue('sub_total', quantity * salesPrice);
            }
        }
    }, [form.values.quantity, form.values.sales_price]);


    useEffect(() => {
        if (form.values.quantity && form.values.price) {
            const discountAmount = (form.values.price * form.values.percent) / 100;
            const salesPrice = form.values.price - discountAmount;

            form.setFieldValue('sales_price', salesPrice);
            form.setFieldValue('sub_total', salesPrice);
        }
    }, [form.values.percent]);


    useHotkeys([['alt+n', () => {
        document.getElementById('product_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const inputGroupText = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {selectProductDetails && selectProductDetails.unit_name}
        </Text>
    );

    const inputGroupCurrency = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
            color={'gray'}
        >
            {currencySymbol}
        </Text>
    );

    const inputRef = useRef(null);
    useEffect(() => {
        const inputElement = document.getElementById('product_id');
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    return (

        <Box>
            <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={15} >
                    <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                        <Box>
                            <form onSubmit={form.onSubmit((values) => {

                                if (!values.barcode && !values.product_id) {
                                    form.setFieldError('barcode', true);
                                    form.setFieldError('product_id', true);
                                    setTimeout(() => { }, 1000)
                                } else {

                                    const cardProducts = localStorage.getItem('temp-sales-products');
                                    const myCardProducts = cardProducts ? JSON.parse(cardProducts) : [];
                                    const storedProducts = localStorage.getItem('core-products');
                                    const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

                                    if (values.product_id && !values.barcode) {
                                        if (!allowZeroPercentage) {
                                            showNotification({
                                                color: 'pink',
                                                title: t('WeNotifyYouThat'),
                                                message: t('ZeroQuantityNotAllow'),
                                                autoClose: 1500,
                                                loading: true,
                                                withCloseButton: true,
                                                position: 'top-center',
                                                style: { backgroundColor: 'mistyrose' },
                                            });
                                        } else {
                                            handleAddProductByProductId(values, myCardProducts, localProducts);
                                        }
                                    } else if (!values.product_id && values.barcode) {
                                        handleAddProductByBarcode(values, myCardProducts, localProducts);
                                    }
                                }

                            })}>
                                <Box pl={`xs`} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Grid columns={24} gutter={{ base: 6 }}>
                                        <Grid.Col span={4}>
                                            <InputNumberForm
                                                tooltip={t('BarcodeValidateMessage')}
                                                label=''
                                                placeholder={t('Barcode')}
                                                required={true}
                                                nextField={''}
                                                form={form}
                                                name={'barcode'}
                                                id={'barcode'}
                                                leftSection={<IconBarcode size={16} opacity={0.5} />}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={20}>
                                            <SelectServerSideForm
                                                tooltip={t('ChooseStockProduct')}
                                                label=''
                                                placeholder={t('ChooseStockProduct')}
                                                required={false}
                                                nextField={'quantity'}
                                                name={'product_id'}
                                                ref={inputRef}
                                                form={form}
                                                id={'product_id'}
                                                searchable={true}
                                                searchValue={searchValue}
                                                setSearchValue={setSearchValue}
                                                dropdownValue={productDropdown}
                                                closeIcon={true}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                    <Box mt={'xs'} pb={'xs'}>
                                        <Grid columns={24} gutter={{ base: 6 }}>
                                            <Grid.Col span={4}>
                                                <InputButtonForm
                                                    type="number"
                                                    tooltip=''
                                                    label=''
                                                    placeholder={t('Price')}
                                                    required={true}
                                                    form={form}
                                                    name={'price'}
                                                    id={'price'}
                                                    rightSection={inputGroupCurrency}
                                                    leftSection={<IconCoinMonero size={16} opacity={0.5} />}
                                                    rightSectionWidth={30}
                                                    disabled={true}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputButtonForm
                                                    type="number"
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    placeholder={t('Quantity')}
                                                    required={true}
                                                    nextField={'percent'}
                                                    form={form}
                                                    name={'quantity'}
                                                    id={'quantity'}
                                                    leftSection={<IconSortAscendingNumbers size={16} opacity={0.5} />}
                                                    rightSection={inputGroupText}
                                                    rightSectionWidth={50}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('PercentValidateMessage')}
                                                    label=''
                                                    placeholder={t('Percent')}
                                                    required={true}
                                                    nextField={form.values.percent ? 'EntityFormSubmit' : 'sales_price'}
                                                    form={form}
                                                    name={'percent'}
                                                    id={'percent'}
                                                    leftSection={<IconPercentage size={16} opacity={0.5} />}
                                                    rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                    closeIcon={true}
                                                />

                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputNumberForm
                                                    tooltip={t('SalesPriceValidateMessage')}
                                                    label=''
                                                    placeholder={t('SalesPrice')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sales_price'}
                                                    id={'sales_price'}
                                                    disabled={form.values.percent}
                                                    leftSection={<IconPlusMinus size={16} opacity={0.5} />}
                                                    rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <InputButtonForm
                                                    tooltip=''
                                                    label=''
                                                    placeholder={t('SubTotal')}
                                                    required={true}
                                                    nextField={'EntityFormSubmit'}
                                                    form={form}
                                                    name={'sub_total'}
                                                    id={'sub_total'}
                                                    leftSection={<IconSum size={16} opacity={0.5} />}
                                                    rightSection={inputGroupCurrency}
                                                    disabled={selectProductDetails && selectProductDetails.sub_total}
                                                    closeIcon={false}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={3}>
                                                <>
                                                    <Button
                                                        size="sm"
                                                        color={`red.5`}
                                                        type="submit"
                                                        mt={0}
                                                        mr={'xs'}
                                                        w={'100%'}
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <Text fz={12} fw={400}>
                                                                {t("Add")}
                                                            </Text>
                                                        </Flex>
                                                    </Button>
                                                </>
                                            </Grid.Col>

                                            <Grid.Col span={1} bg={'white'}>
                                                <Tooltip
                                                    multiline
                                                    bg={'orange.8'}
                                                    position="top"
                                                    withArrow
                                                    ta={'center'}
                                                    offset={{ crossAxis: '-50', mainAxis: '5' }}
                                                    transitionProps={{ duration: 200 }}
                                                    label={t('InstantProductCreate')}
                                                >
                                                    <ActionIcon
                                                        variant="outline"
                                                        size={'lg'}
                                                        color="red.5"
                                                        mt={'1'}
                                                        aria-label="Settings"
                                                        onClick={() => setProductDrawer(true)}
                                                    >
                                                        <IconPlus style={{ width: '100%', height: '70%' }}
                                                            stroke={1.5} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </Box>
                            </form>

                        </Box>
                        <Box className={'borderRadiusAll'}>
                            <DataTable
                                classNames={{
                                    root: tableCss.root,
                                    table: tableCss.table,
                                    header: tableCss.header,
                                    footer: tableCss.footer,
                                    pagination: tableCss.pagination,
                                }}
                                records={tempCardProducts}
                                columns={[
                                    {
                                        accessor: 'index',
                                        title: t('S/N'),
                                        textAlignment: 'right',
                                        width: '50px',
                                        render: (item) => (tempCardProducts.indexOf(item) + 1)
                                    },
                                    {
                                        accessor: 'display_name',
                                        title: t("Name"),
                                        width: '200px',
                                        footer: (
                                            <Group spacing="xs">
                                                <IconSum size="1.25em" />
                                                <Text mb={-2}>{tempCardProducts.length} {t('Items')}</Text>
                                            </Group>
                                        )
                                    },
                                    {
                                        accessor: 'price',
                                        title: t('Price'),
                                        textAlign: "right",
                                        render: (item) => {
                                            return (
                                                item.price && Number(item.price).toFixed(2)
                                            );
                                        }
                                    },

                                    {
                                        accessor: 'stock',
                                        title: t('Stock'),
                                        textAlign: "center"
                                    },
                                    {
                                        accessor: 'quantity',
                                        title: t('Quantity'),
                                        textAlign: "center",
                                        width: '100px',
                                        render: (item) => {
                                            const [editedQuantity, setEditedQuantity] = useState(item.quantity);

                                            const handlQuantityChange = (e) => {
                                                const editedQuantity = e.currentTarget.value;
                                                setEditedQuantity(editedQuantity);

                                                const tempCardProducts = localStorage.getItem('temp-sales-products');
                                                const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];

                                                const updatedProducts = cardProducts.map(product => {
                                                    if (product.product_id === item.product_id) {
                                                        return {
                                                            ...product,
                                                            quantity: e.currentTarget.value,
                                                            sub_total: e.currentTarget.value * item.sales_price,
                                                        };
                                                    }
                                                    return product
                                                });

                                                localStorage.setItem('temp-sales-products', JSON.stringify(updatedProducts));
                                                setLoadCardProducts(true)
                                            };

                                            return (
                                                <>
                                                    <TextInput
                                                        type="number"
                                                        label=""
                                                        size="xs"
                                                        value={editedQuantity}
                                                        onChange={handlQuantityChange}
                                                        onKeyDown={getHotkeyHandler([
                                                            ['Enter', (e) => {
                                                                document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                                            }],
                                                        ])}
                                                    />
                                                </>
                                            );
                                        }
                                    },
                                    {
                                        accessor: 'unit_name',
                                        title: t('UOM'),
                                        textAlign: "center"
                                    },
                                    {
                                        accessor: 'sales_price',
                                        title: t('SalesPrice'),
                                        textAlign: "center",
                                        width: '100px',
                                        render: (item) => {
                                            const [editedSalesPrice, setEditedSalesPrice] = useState(item.sales_price);

                                            const handleSalesPriceChange = (e) => {
                                                const newSalesPrice = e.currentTarget.value;
                                                setEditedSalesPrice(newSalesPrice);
                                            };

                                            useEffect(() => {
                                                const timeoutId = setTimeout(() => {
                                                    const tempCardProducts = localStorage.getItem('temp-sales-products');
                                                    const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];
                                                    const updatedProducts = cardProducts.map(product => {
                                                        if (product.product_id === item.product_id) {
                                                            return {
                                                                ...product,
                                                                sales_price: editedSalesPrice,
                                                                sub_total: editedSalesPrice * item.quantity,
                                                            };
                                                        }
                                                        return product;
                                                    });

                                                    localStorage.setItem('temp-sales-products', JSON.stringify(updatedProducts));
                                                    setLoadCardProducts(true);
                                                }, 1000);

                                                return () => clearTimeout(timeoutId);
                                            }, [editedSalesPrice, item.product_id, item.quantity]);

                                            return (
                                                item.percent ?
                                                    Number(item.sales_price).toFixed(2)
                                                    :
                                                    <>
                                                        <TextInput
                                                            type="number"
                                                            label=""
                                                            size="xs"
                                                            id={'inline-update-quantity-' + item.product_id}
                                                            value={editedSalesPrice}
                                                            onChange={handleSalesPriceChange}
                                                        />
                                                    </>
                                            );
                                        }
                                    },
                                    {
                                        accessor: 'percent',
                                        title: t('Discount'),
                                        textAlign: "center",
                                        width: '100px',
                                        render: (item) => {
                                            const [editedPercent, setEditedPercent] = useState(item.percent);
                                            const handlePercentChange = (e) => {
                                                const editedPercent = e.currentTarget.value;
                                                setEditedPercent(editedPercent);

                                                const tempCardProducts = localStorage.getItem('temp-sales-products');
                                                const cardProducts = tempCardProducts ? JSON.parse(tempCardProducts) : [];

                                                if (e.currentTarget.value && e.currentTarget.value >= 0) {
                                                    const updatedProducts = cardProducts.map(product => {
                                                        if (product.product_id === item.product_id) {
                                                            const discountAmount = (item.price * editedPercent) / 100;
                                                            const salesPrice = item.price - discountAmount;

                                                            return {
                                                                ...product,
                                                                percent: editedPercent,
                                                                sales_price: salesPrice,
                                                                sub_total: salesPrice * item.quantity,
                                                            };
                                                        }
                                                        return product
                                                    });

                                                    localStorage.setItem('temp-sales-products', JSON.stringify(updatedProducts));
                                                    setLoadCardProducts(true)
                                                }
                                            };

                                            return (
                                                item.percent ?
                                                    <>
                                                        <TextInput
                                                            type="number"
                                                            label=""
                                                            size="xs"
                                                            value={editedPercent}
                                                            onChange={handlePercentChange}
                                                            rightSection={
                                                                editedPercent === '' ?
                                                                    <>{item.percent}<IconPercentage size={16} opacity={0.5} /></>
                                                                    :
                                                                    <IconPercentage size={16} opacity={0.5} />
                                                            }
                                                        />
                                                    </>
                                                    :
                                                    <Text size={'xs'} ta="right">
                                                        {(Number(item.price) - Number(item.sales_price)).toFixed(2)}
                                                    </Text>
                                            );
                                        },
                                        footer: (
                                            <Group spacing="xs" >
                                                <Text fz={'md'} fw={'600'}>{t('SubTotal')}</Text>
                                            </Group>
                                        ),
                                    },

                                    {
                                        accessor: 'sub_total',
                                        title: t('SubTotal'),
                                        textAlign: "right",
                                        render: (item) => {
                                            return (
                                                item.sub_total && Number(item.sub_total).toFixed(2)
                                            );
                                        },
                                        footer: (
                                            <Group spacing="xs">
                                                <Text fw={'600'} fz={'md'}>{
                                                    salesSubTotalAmount.toFixed(2)
                                                }</Text>
                                            </Group>
                                        ),
                                    },
                                    {
                                        accessor: "action",
                                        title: t('Action'),
                                        textAlign: "right",
                                        render: (item) => (
                                            <Group gap={4} justify="right" wrap="nowrap">

                                                <ActionIcon
                                                    size="sm"
                                                    variant="subtle"
                                                    color='var( --theme-remove-color)'
                                                    onClick={() => {
                                                        const dataString = localStorage.getItem('temp-sales-products');
                                                        let data = dataString ? JSON.parse(dataString) : [];

                                                        data = data.filter(d => d.product_id !== item.product_id);

                                                        const updatedDataString = JSON.stringify(data);

                                                        localStorage.setItem('temp-sales-products', updatedDataString);
                                                        setLoadCardProducts(true)
                                                    }}
                                                >
                                                    <IconX size={16} style={{ width: '70%', height: '70%' }}
                                                        stroke={1.5} />
                                                </ActionIcon>
                                            </Group>
                                        ),
                                    },
                                ]
                                }
                                fetching={fetching}
                                totalRecords={100}
                                recordsPerPage={10}
                                loaderSize="xs"
                                loaderColor="grape"
                                height={height}
                                scrollAreaProps={{ type: 'never' }}
                            />
                        </Box>

                    </Box>
                </Grid.Col>
                {/*<Grid.Col span={8} >
                    <Box bg={'white'} p={'md'} className={'borderRadiusAll'}>
                        <__SalesForm
                            salesSubTotalAmount={salesSubTotalAmount}
                            tempCardProducts={tempCardProducts}
                            totalPurchaseAmount={totalPurchaseAmount}
                            currencySymbol={currencySymbol}
                            setLoadCardProducts={setLoadCardProducts}
                            domainId={domainId}
                            isSMSActive={isSMSActive}
                            isZeroReceiveAllow={isZeroReceiveAllow}
                        />
                    </Box>
                </Grid.Col>*/}
                {/*<Grid.Col span={1} >
                    <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                        <_ShortcutInvoice
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'CompanyName'}
                        />
                    </Box>
                </Grid.Col>*/}
            </Grid>
            {productDrawer &&
                <AddProductDrawer
                    productDrawer={productDrawer}
                    setProductDrawer={setProductDrawer}
                    setStockProductRestore={setStockProductRestore}
                    focusField={'product_id'}
                    fieldPrefix="sales_"
                />
            }
        </Box>
    );
}

export default _GenericInvoiceForm;
