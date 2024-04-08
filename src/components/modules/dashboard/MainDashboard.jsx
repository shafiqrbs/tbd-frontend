import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Tabs,
    rem,
    Text,
    Tooltip,
    Flex,
    LoadingOverlay,
    Badge,
    Title,
    Card,
    SimpleGrid,
    Container,
    useMantineTheme,List,ThemeIcon,Anchor
} from "@mantine/core";
import { IconGauge, IconUser, IconCookie,IconCircleDashed } from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck,
    IconColorFilter,
    IconList,
    IconX,
} from "@tabler/icons-react";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import classes from '../../../assets/css/FeaturesCards.module.css';

const mockdata = [
    {
        title: 'Extreme performance',
        description:
            'This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit',
        icon: IconGauge,
    },
    {
        title: 'Privacy focused',
        description:
            'People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma',
        icon: IconUser,
    },
    {
        title: 'No third parties',
        description:
            'They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves',
        icon: IconCookie,
    },
];

function MainDashboard() {
    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("ThreeGrid");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [isFormSubmit, setFormSubmit] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState([]);

    const theme = useMantineTheme();
    const features = mockdata.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
            <feature.icon
                style={{ width: rem(50), height: rem(50) }}
                stroke={2}
                color={theme.colors.blue[6]}
            />
            <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
                {feature.title}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm">
                {feature.description}
            </Text>
        </Card>
    ));

    const form = useForm({
        initialValues: {},
        validate: {
            name: hasLength({min: 2, max: 10}),
            email: isEmail(),

        },
    });

    return (
        <>
            <Container size="xl" py="xl">
                <Group justify="center">
                    <Badge variant="filled" size="lg">
                      Dashboard
                    </Badge>
                </Group>

                <Title order={2} className={classes.title} ta="center" mt="sm">
                    Intial Dashboard for Sample
                </Title>

                <Text c="dimmed" className={classes.description} ta="center" mt="md">
                    Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
                    hunger drives it to try biting a Steel-type Pokémon.
                </Text>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
                    {features}
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
                    <Card  shadow="md" radius="md" className={classes.card} padding="xl">
                        <IconCircleCheck
                            style={{ width: rem(50), height: rem(50) }}
                            stroke={2}
                            color={theme.colors.blue[6]}
                        />
                        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
                           System Master Data
                        </Text>
                        <Text fz="sm" c="dimmed" mt="sm">
                            <List>
                                <List.Item>Clone or download repository from GitHub</List.Item>
                                <List.Item>Install dependencies with yarn</List.Item>
                                <List.Item>To start development server run npm start command</List.Item>
                                <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                                <List.Item>Submit a pull request once you are done</List.Item>
                            </List>
                        </Text>
                    </Card>
                    <Card  shadow="md" radius="md" className={classes.card} padding="xl">
                        <IconCircleCheck
                            style={{ width: rem(50), height: rem(50) }}
                            stroke={2}
                            color={theme.colors.blue[6]}
                        />
                        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
                           System Master Data
                        </Text>
                        <Text fz="sm" c="dimmed" mt="sm">
                            <List
                                spacing="xs"
                                size="sm"
                                center
                                icon={
                                    <ThemeIcon color="teal" size={24} radius="xl">
                                        <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
                                    </ThemeIcon>
                                }
                            >
                                  <List.Item
                                    icon={
                                        <ThemeIcon color="blue" size={24} radius="xl">
                                            <IconUser style={{ width: rem(16), height: rem(16) }} />
                                        </ThemeIcon>
                                    }
                                >
                                    <Anchor href="/core/user"  underline="hover">
                                       Users
                                    </Anchor>
                                </List.Item>
                                <List.Item
                                    icon={
                                        <ThemeIcon color="blue" size={24} radius="xl">
                                            <IconUser style={{ width: rem(16), height: rem(16) }} />
                                        </ThemeIcon>
                                    }
                                >
                                    <Anchor href="/core/user"  underline="hover">
                                        Users
                                    </Anchor>
                                </List.Item>
                                <List.Item
                                    icon={
                                        <ThemeIcon color="blue" size={24} radius="xl">
                                            <IconUser style={{ width: rem(16), height: rem(16) }} />
                                        </ThemeIcon>
                                    }
                                >
                                    <Anchor href="/core/user"  underline="hover">
                                        Users
                                    </Anchor>
                                </List.Item>
                            </List>
                        </Text>
                    </Card>
                </SimpleGrid>
            </Container>
        </>
    );
}

export default MainDashboard;
