import { selectCurrentOnGoingQuizQuestions } from '@Feature/quiz/QuizSlice';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useGetStartTimeOfTheQuizQuery } from '@ReduxStore/apis/apiSlice';
import { useAppSelector } from '@ReduxStore/hooks';
import addMinutes from 'date-fns/addMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { compose } from 'ramda';
import {
    Dispatch as ReactDispatch,
    SetStateAction as ReactSetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
type startQuizHeaderProps = {
    quizName: string;
    quizId: string;
    quizDuration: number;
    isQuickSelectViewOpen: boolean;
    quizSubmitHandler: () => Promise<boolean>;
    setIsAlreadyGivenTheQuizAlertPopupOpen: ReactDispatch<
        ReactSetStateAction<boolean>
    >;
};
function StartQuizHeader(props: startQuizHeaderProps) {
    const {
        quizName,
        quizId,
        quizDuration,
        isQuickSelectViewOpen,
        quizSubmitHandler,
        setIsAlreadyGivenTheQuizAlertPopupOpen,
    } = props;
    let navigate = useNavigate();

    const isExamStarted = useRef(false);
    const { data: startTimeData, refetch } =
        useGetStartTimeOfTheQuizQuery(quizId);
    const [timer, setTime] = useState([0, 0, 0]);
    useEffect(() => {
        refetch();
    }, [refetch]);
    const quizSubmitHandlerHelper = async () => {
        await quizSubmitHandler();
        navigate('/quiz/result');
    };
    const questionsList = useAppSelector(selectCurrentOnGoingQuizQuestions);
    useEffect(() => {
        const timeIntervalId = setInterval(() => {
            const startedAt = new Date(startTimeData?.startTime ?? '');
            const endTime = addMinutes(startedAt, quizDuration);
            const timeDiff = differenceInSeconds(endTime, new Date());
            if (isNaN(timeDiff)) return;
            if (timeDiff < 1) {
                clearInterval(timeIntervalId);
                if (isExamStarted.current) quizSubmitHandlerHelper();
                else setIsAlreadyGivenTheQuizAlertPopupOpen(true);
                return;
            }
            isExamStarted.current = true;
            compose(setTime, getHoursMinsAndSecondsFromSeconds)(timeDiff);
        }, 1000);
        return () => clearInterval(timeIntervalId);
        // eslint-disable-next-line
    }, [startTimeData, quizDuration, questionsList]);
    const hours = timer[0] > 9 ? `${timer[0]}` : `0${timer[0]}`;
    const mins = timer[1] > 9 ? `${timer[1]}` : `0${timer[1]}`;
    const seconds = timer[2] > 9 ? `${timer[2]}` : `0${timer[2]}`;
    return (
        <AppBar position="static" color="transparent">
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'space-between',
                        display: { xs: 'none', md: 'flex' },
                    }}
                >
                    <Typography variant="h6" component="div">
                        {quizName}
                    </Typography>
                    <Typography
                        variant="button"
                        gutterBottom
                        component="div"
                        sx={{
                            marginRight:
                                isQuickSelectViewOpen === true
                                    ? '240px'
                                    : '0px',
                        }}
                    >
                        {`${hours} : ${mins} : ${seconds}`}
                    </Typography>
                </Toolbar>
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent:
                            isQuickSelectViewOpen === true ? 'start' : 'center',
                        display: { xs: 'flex', md: 'none' },
                    }}
                >
                    <Typography variant="button" gutterBottom component="div">
                        {`${hours} : ${mins} : ${seconds}`}
                    </Typography>
                </Toolbar>
                <Divider
                    variant="fullWidth"
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                />
                <Toolbar
                    disableGutters
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        align={
                            isQuickSelectViewOpen === true ? 'left' : 'center'
                        }
                        sx={{ width: '100%' }}
                    >
                        {quizName}
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default StartQuizHeader;
function getHoursMinsAndSecondsFromSeconds(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    seconds -= 3600 * hours;
    const mins = Math.floor(seconds / 60);
    seconds -= 60 * mins;
    return [hours, mins, seconds];
}
