import { selectUserDetails, unauthorizedUser } from '@Feature/auth/authSlice';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@ReduxStore/hooks';
import { compose } from 'ramda';
import {
    MouseEvent as ReactMouseEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const settings = ['Profile', 'Logout'];

const Header = () => {
    const dispatch = useAppDispatch();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: ReactMouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: ReactMouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const userDetails = useAppSelector(selectUserDetails);
    const pages = getNavBtnForCurrentUser(userDetails?.role);
    let location = useLocation();
    let navigate = useNavigate();
    const [currentActiveNavBtn, setCurrentActiveBtn] = useState('Live Quizzes');
    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setCurrentActiveBtn('Live Quizzes');
                break;
            case '/quiz/make-a-quiz':
                setCurrentActiveBtn('Make a Quiz');
                break;
            case '/quiz/history':
                setCurrentActiveBtn('Quizzes History');
                break;
            default:
                setCurrentActiveBtn('');
                break;
        }
    }, [location]);
    const settingsHandler = (settingKey: string) => {
        switch (settingKey) {
            case 'Logout':
                compose(dispatch, unauthorizedUser)();
                break;
            default:
                break;
        }
        handleCloseUserMenu();
    };
    let userFullName = useMemo(() => {
        if (userDetails !== null) {
            return userDetails.name;
        }
        return 'Unnamed User';
    }, [userDetails]);
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Quiz
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.path}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate(page.path);
                                    }}
                                >
                                    <Typography textAlign="center">
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Quiz
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page.path}
                                onClick={() => navigate(page.path)}
                                sx={{
                                    m: 2,
                                    color: 'white',
                                    display: 'block',
                                    borderBottom:
                                        currentActiveNavBtn === page.name
                                            ? '1px solid #bdbdbd'
                                            : 'none',
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar {...stringAvatar(userFullName)} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={() => settingsHandler(setting)}
                                    disabled={setting === 'Profile'}
                                >
                                    <Typography textAlign="center">
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Header;

// Util Function
function getNavBtnForCurrentUser(role = 'examinee') {
    switch (role.toLowerCase()) {
        case 'examinee':
            return [
                { name: 'Live Quizzes', path: '/' },
                { name: 'Quizzes History', path: '/quiz/history' },
            ];
        case 'examiner':
            return [
                { name: 'Live Quizzes', path: '/' },
                { name: 'Make a Quiz', path: '/quiz/make-a-quiz' },
            ];
        default:
            return [];
    }
}

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    const [firstName = ' ', lastName = ' '] = name
        .split(' ')
        .map((e) => e.toUpperCase());

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${firstName[0]}${lastName[0]}`,
    };
}
