import classes from './Header2.module.css';

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

import { Link } from "react-router-dom";



export default function Header2() {

    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
    return (
        <div className="bg-white pb-5 rounded-lg">
            <nav className="flex px-4 border-b md:shadow-lg items-center relative">
                <div className="text-lg font-bold md:py-0 py-4">
                    Logo
                </div>
                <ul className="hidden md:px-2 ml-auto md:flex md:space-x-2 absolute md:relative top-full left-0 right-0">
                    <li>
                        <a href="#" className="flex md:inline-flex p-4 items-center hover:bg-gray-50">
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex md:inline-flex p-4 items-center hover:bg-gray-50">
                            <span>Products</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex md:inline-flex p-4 items-center hover:bg-gray-50">
                            <span>About us</span>
                        </a>
                    </li>
                </ul>
                <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
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

                        </Group>
                    </ScrollArea>
                </Drawer>
            </nav>
        </div>

    )
}