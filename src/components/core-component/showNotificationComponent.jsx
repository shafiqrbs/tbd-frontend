import { notifications } from '@mantine/notifications';
import { rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export const showNotificationComponent = (title, color, backgroundColor, message = null, loading = false, autoClose = 2000, autoCloseButton = true) => {
    notifications.show({
        color: color,
        title: title,
        message: message,
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: loading,
        autoClose: autoClose,
        style: { backgroundColor },
        withCloseButton: autoCloseButton,
    });
};
