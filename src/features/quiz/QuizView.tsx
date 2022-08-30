import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AutoHideAlertProps, Quiz } from '@Type/Quiz';
import { useMemo } from 'react';
import QuizCardView from './QuizCardView';
type MyQuizViewProps =
    | {
          isFetching: boolean;
          isError: boolean;
          quizList: Quiz[];
          shouldShowReloadBtn: boolean;
          reFetchQuizList: () => void;
          cardViewGridStyle: {
              xs: number;
              md: number;
          };
          headerTitle: string;
          roleOfUser: 'examiner';
      }
    | {
          isFetching: boolean;
          isError: boolean;
          quizList: Quiz[];
          shouldShowReloadBtn: boolean;
          reFetchQuizList: () => void;
          cardViewGridStyle: {
              xs: number;
              md: number;
          };
          headerTitle: string;
          roleOfUser: 'examinee';
          renderedBy: 'liveQuizzes' | 'enrolledQuizzes';
          setAlertMsg: (payload: AutoHideAlertProps) => void;
      };
export default function QuizView(props: MyQuizViewProps) {
    const {
        isFetching,
        isError,
        quizList,
        shouldShowReloadBtn,
        reFetchQuizList,
        cardViewGridStyle,
        headerTitle,
        roleOfUser,
    } = props;
    const noQuizMsg = useMemo(() => {
        switch (headerTitle) {
            case 'My Quizzes':
                return 'You are not enrolled for any quiz.';
            case 'Live Quizzes':
                return 'There is no quiz live yet.';
            default:
                return 'No Quiz';
        }
    }, [headerTitle]);
    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                component="div"
                textAlign={'center'}
                paddingTop={1}
            >
                {headerTitle}
            </Typography>
            <Divider variant="middle" />
            <Grid
                container
                columns={{ xs: 4, md: 12 }}
                sx={{
                    maxHeight: '75vh',
                    minHeight: '75vh',
                    overflowY: 'auto',
                }}
                className={'scroll'}
            >
                {isFetching && (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                {!isFetching &&
                    !isError &&
                    quizList.map((quiz: Quiz) => {
                        return (
                            <Grid item {...cardViewGridStyle} key={quiz._id}>
                                {roleOfUser === 'examiner' && (
                                    <QuizCardView
                                        quiz={quiz}
                                        roleOfUser={roleOfUser}
                                    />
                                )}
                                {roleOfUser === 'examinee' && (
                                    <QuizCardView
                                        quiz={quiz}
                                        roleOfUser={roleOfUser}
                                        renderedBy={props.renderedBy}
                                        setAlertMsg={props.setAlertMsg}
                                    />
                                )}
                            </Grid>
                        );
                    })}
                {!isFetching && !isError && quizList.length === 0 && (
                    <NoQuizView msg={noQuizMsg} />
                )}
                {!isFetching && isError && (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="body1"
                            gutterBottom
                            component="div"
                            textAlign={'center'}
                            color={'error'}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {'Unable to fetch all live Quizzes'}
                        </Typography>
                        {shouldShowReloadBtn ? (
                            <Button
                                variant="outlined"
                                endIcon={<ReplayIcon />}
                                onClick={reFetchQuizList}
                            >
                                Reload
                            </Button>
                        ) : (
                            <Typography
                                variant="button"
                                gutterBottom
                                component="div"
                                textAlign={'center'}
                                sx={{
                                    textTransform: 'capitalize',
                                }}
                            >
                                {'Try After Sometime.....'}
                            </Typography>
                        )}
                    </Box>
                )}
            </Grid>
        </>
    );
}

// Util Component:
type NoQuizViewProps = {
    msg: string;
};
function NoQuizView(props: NoQuizViewProps) {
    const { msg } = props;
    return (
        <Typography
            variant="body1"
            gutterBottom
            sx={{ width: '100%', height: '60vh',display:'flex',justifyContent:'center',alignItems:'center' }}

        >
            {msg}
        </Typography>
    );
}
