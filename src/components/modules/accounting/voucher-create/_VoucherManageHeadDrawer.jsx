import React, { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Drawer,
  Text,
  Button,
  Flex,
  Group,
  Stack,
  ScrollArea,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import getAccountingSubHeadDropdownData from '../../../global-hook/dropdown/getAccountingSubHeadDropdownData';
import InputCheckboxForm from '../../../form-builders/InputCheckboxForm';
import { storeEntityData } from '../../../../store/core/crudSlice';
import { modals } from '@mantine/modals';
import { showNotificationComponent } from '../../../core-component/showNotificationComponent';
import { useForm } from '@mantine/form';

function _VoucherManageHeadDrawer(props) {
  const {
    manageVoucherHeadDrawer,
    setManageVoucherHeadDrawer,
    manageVoucherData,
    setManageVoucherData,
  } = props;

  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const height = mainAreaHeight;
  const accountDropdownData = getAccountingSubHeadDropdownData();

  const primarySelectedIds = useMemo(
      () => manageVoucherData?.ledger_account_head_primary?.map((item) => item.id) ?? [],
      [manageVoucherData]
  );

  const secondarySelectedIds = useMemo(
      () => manageVoucherData?.ledger_account_head_secondary?.map((item) => item.id) ?? [],
      [manageVoucherData]
  );

  const form = useForm({ initialValues: {} });

  useEffect(() => {
    if (!accountDropdownData?.length || !manageVoucherData) return;

    const values = {};
    accountDropdownData.forEach((head) => {
      const headId = Number(head.value);
      values[`${headId}_primary`] = primarySelectedIds.includes(headId) ? 1 : 0;
      values[`${headId}_secondary`] = secondarySelectedIds.includes(headId) ? 1 : 0;
    });
    form.setValues(values);
  }, [accountDropdownData, manageVoucherData]);

  const closeDrawer = () => {
    setManageVoucherHeadDrawer(false);
  };

  const handleVoucherFormSubmit = (values) => {
    modals.openConfirmModal({
      title: <Text size="md">{t('FormConfirmationTitle')}</Text>,
      children: <Text size="sm">{t('FormConfirmationMessage')}</Text>,
      labels: { confirm: t('Submit'), cancel: t('Cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => handleVoucherConfirmFormSubmit(values),
    });
  };

  const handleVoucherConfirmFormSubmit = async (values) => {
    const primarySelected = [];
    const secondarySelected = [];

    Object.entries(form.values).forEach(([key, value]) => {
      if (value === 1) {
        const [id, group] = key.split('_');
        if (group === 'primary') primarySelected.push(Number(id));
        if (group === 'secondary') secondarySelected.push(Number(id));
      }
    });

    const payload = {
      url: 'accounting/voucher/update-heads',
      data: {
        account_voucher_id: manageVoucherData?.id,
        primary_head_id: primarySelected,
        secondary_head_id: secondarySelected,
      },
    };

    try {
      const result = await dispatch(storeEntityData(payload));
      if (storeEntityData.fulfilled.match(result) && result.payload?.status === 200) {
        showNotificationComponent(t('UpdateSuccessfully'), 'teal');
      } else {
        showNotificationComponent(t('UpdateFailed'), 'red');
      }
    } catch (err) {
      console.error(err);
      showNotificationComponent(t('UpdateFailed'), 'red');
    }
  };

  const renderHeadCheckboxes = (type) => (
      <>

        {accountDropdownData?.map((head) => (
            <Box key={`${head.value}_${type}`}>
              <InputCheckboxForm
                  form={form}
                  label={head.label}
                  field={`${head.value}_${type}`}
                  name={`${head.value}_${type}`}
                  value={head.value}
              />
            </Box>
        ))}
      </>
  );

  return (
      <Drawer.Root
          opened={manageVoucherHeadDrawer}
          position="right"
          onClose={closeDrawer}
          size="30%"
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text fw={600} fz={16}>
                {t('VoucherSetupHead')}
              </Text>
            </Drawer.Title>
            <ActionIcon
                variant="transparent"
                radius="xl"
                color="black"
                size="lg"
                onClick={closeDrawer}
            >
              <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Drawer.Header>

          <Box h={height}>
            <form onSubmit={form.onSubmit(handleVoucherFormSubmit)}>
              <Box>
                <Box bg="gray.1"  px="sm" py="xs" >
                  <Text fz={14} fw={600}>{t('PrimaryVoucherHead')}{height}</Text>
                </Box>
                <ScrollArea h={height - 450} scrollbarSize={2} scrollbars="y" >
                  <Box p="md" className="borderRadiusAll">
                    {manageVoucherData?.id && (
                        <>
                          {renderHeadCheckboxes('primary')}
                        </>
                    )}
                  </Box>
                </ScrollArea>
              </Box>
              <Box>
              <Box bg="gray.1"  px="sm" py="xs" >
                <Text fz={14} fw={600}>{t('SecondaryVoucherHead')}</Text>
              </Box>
              <ScrollArea h={height - 440} scrollbarSize={2} scrollbars="y" >
                <Box p="md" className="borderRadiusAll">
                  {manageVoucherData?.id && (
                      <>
                        {renderHeadCheckboxes('secondary')}
                      </>
                  )}
                </Box>
              </ScrollArea>
              </Box>

              <Box
                  pl="xs"
                  pr={8}
                  pt="6"
                  pb="6"
                  mb="2"
                  mt={4}
                  className="boxBackground borderRadiusAll"
              >
                <Group justify="space-between">
                  <Flex gap="md" justify="center" align="center" direction="row" wrap="wrap">
                    <ActionIcon
                        variant="transparent"
                        size="sm"
                        color="black"
                        onClick={closeDrawer}
                        ml={4}
                    >
                      <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                    </ActionIcon>
                  </Flex>
                  <Group gap={8}>
                    <Stack align="flex-start">
                      {isOnline && (
                          <Button
                              size="xs"
                              className="btnPrimaryBg"
                              type="submit"
                              leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction="column" gap={0}>
                              <Text fz={14} fw={400}>
                                {t('CreateAndSave')}
                              </Text>
                            </Flex>
                          </Button>
                      )}
                    </Stack>
                  </Group>
                </Group>
              </Box>
            </form>
          </Box>
        </Drawer.Content>
      </Drawer.Root>
  );
}

export default _VoucherManageHeadDrawer;
