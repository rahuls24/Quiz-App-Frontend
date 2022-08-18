import Box from '@mui/material/Box';

type NoQuizInHistoryTableProps = {
    content: JSX.Element;
};
export default function NoQuizInHistoryTable(props: NoQuizInHistoryTableProps) {
    const { content } = props;
    return (
        <Box
            sx={{
                width: '100%',
                height: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {content}
        </Box>
    );
}
