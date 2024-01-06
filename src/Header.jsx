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
import { useAppContext } from './AppContext.jsx';
import { GoogleLogin } from '@react-oauth/google';

function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
    const { user, setUser } = useAppContext();

    function loginandlogoutButton() {
        if (user) {
            return (
                <Button component={Link} to="/" onClick={() => { setUser(null) }}> Logout </Button>
            )
        } else {
            return (
                <Button component={Link} to="/login">Login</Button>
            )
        }
    }

    return (
        <Box pb={20} pt={20}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Text size="lg" weight={500}>
                        Chess Trainer
                    </Text>
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <Link to="/" className={classes.link}> Home </Link>
                        <Link to="/analyze" className={classes.link}> Analyze </Link>
                        <Link to="/mypuzzles" className={classes.link}> My Puzzles </Link>
                        {loginandlogoutButton()}
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

                    <Link to="/" className={classes.link}> Home </Link>
                    <Link to="/analyze" className={classes.link}> Analyze </Link>
                    <Link to="/mypuzzles" className={classes.link}> My Puzzles </Link>
                    <Divider my="sm" />
                    <Group justify="center" grow pb="xl" px="md">
                        <Button component={Link} to="/login">Login</Button>
                        {loginandlogoutButton()}
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}

export default Header;