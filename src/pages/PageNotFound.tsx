import useDocumentTitle from '@CustomHook/useDocumentTitle';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// const primary = purple[500]; // #f44336

export default function PageNotFound() {

    // Change Document Tile 
    useDocumentTitle('Quiz App | 404')
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#d32f2f',
            }}
        >
            <Typography variant="h1" style={{ color: 'white' }}>
                {'404'}
            </Typography>
            <Typography
                variant="h6"
                style={{
                    color: 'white',
                    marginBottom: 4,
                    wordBreak: 'break-all',
                }}
            >
                {'The page you’re looking for doesn’t exist.'}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
                {'Back Home'}
            </Button>
        </Box>
    );
}
