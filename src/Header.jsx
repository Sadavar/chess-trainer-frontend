import {
    HoverCard,
    Group,
    Button,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Anchor,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    rem,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconNotification,
    IconCode,
    IconBook,
    IconChartPie3,
    IconFingerprint,
    IconCoin,
    IconChevronDown,
} from '@tabler/icons-react';
import classes from './Header.module.css';
import { Link } from "react-router-dom";

function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();

    return (
        <Box pb={20} pt={20}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Text size="lg" weight={500}>
                        Chess Trainer
                    </Text>
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="/" className={classes.link}>
                            Home
                        </a>
                        <a href="/Analyze" className={classes.link}>
                            Analyze
                        </a>
                        <a href="/" className={classes.link}>
                            Puzzles
                        </a>
                        <Button component={Link} to="/Login" >Login</Button>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />

                    <a href="/" className={classes.link}>
                        Home
                    </a>
                    <a href="/Analyze" className={classes.link}>
                        Analyze
                    </a>
                    <a href="/Puzzles" className={classes.link}>
                        Puzzles
                    </a>
                    <Divider my="sm" />
                    <Group justify="center" grow pb="xl" px="md">
                        <Button component={Link} to="/Login">Login</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}

export default Header;