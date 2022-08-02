import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { PieChart } from 'react-minimal-pie-chart';
import CircleIcon from '@mui/icons-material/Circle';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { useAppSelector } from '../../../app/hooks';
import { selectQuizResultDetails } from '../QuizSlice';
const sections = [
    {
        sectionName: 'CORRECT',
        bulletColor: 'success' as 'success',
    },
    {
        sectionName: 'WRONG',
        bulletColor: 'error' as 'error',
    },
    {
        sectionName: 'SKIPPED',
        bulletColor: 'inherit' as 'inherit',
    },
];

type ScorePieChartProps = {
    numberOfRightAnswers: number;
    numberOfWrongAnswers: number;
    skippedQuestions: number;
};
function ScorePieChart(props: ScorePieChartProps) {
    const { numberOfRightAnswers, numberOfWrongAnswers, skippedQuestions } =
        props;
    const [
        currentSelectedSectionOfPieChart,
        setCurrentSelectedSectionOfPieChart,
    ] = React.useState<number | undefined>(undefined);
    const currentSelectedSectionOfPieChartHandler = (index: number) => {
        setCurrentSelectedSectionOfPieChart(
            index === currentSelectedSectionOfPieChart ? undefined : index
        );
    };
    const totalNumberOfQuestions = React.useMemo(() => {
        return numberOfRightAnswers + numberOfWrongAnswers + skippedQuestions;
    }, [numberOfRightAnswers, numberOfWrongAnswers, skippedQuestions]);
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <PieChart
                    data={[
                        {
                            title: 'Correct',
                            value: numberOfRightAnswers,
                            color: '#2e7d32',
                        },
                        {
                            title: 'Wrong',
                            value: numberOfWrongAnswers,
                            color: '#d32f2f',
                        },
                        {
                            title: 'Skipped',
                            value: skippedQuestions,
                            color: '#7D7D7D',
                        },
                    ]}
                    style={{ height: '150px', fontSize: '8px' }}
                    radius={PieChart.defaultProps.radius - 6}
                    lineWidth={60}
                    totalValue={totalNumberOfQuestions}
                    segmentsStyle={{
                        transition: 'stroke .3s',
                        cursor: 'pointer',
                    }}
                    segmentsShift={(index) =>
                        index === currentSelectedSectionOfPieChart ? 6 : 1
                    }
                    label={({ dataEntry }) =>
                        Math.round(dataEntry.percentage) + '%'
                    }
                    labelPosition={100 - 60 / 2}
                    labelStyle={{
                        fill: '#fff',
                        opacity: 0.75,
                        pointerEvents: 'none',
                    }}
                    onClick={(_, index) => {
                        setCurrentSelectedSectionOfPieChart(
                            index === currentSelectedSectionOfPieChart
                                ? undefined
                                : index
                        );
                    }}
                />
                <List>
                    {sections.map((section, index) => {
                        return (
                            <>
                                <ListItem
                                    sx={{
                                        display: 'list-item',
                                    }}
                                >
                                    <ListItemButton
                                        onClick={() =>
                                            currentSelectedSectionOfPieChartHandler(
                                                index
                                            )
                                        }
                                        sx={{
                                            backgroundColor:
                                                currentSelectedSectionOfPieChart ===
                                                index
                                                    ? '#F5F5F5'
                                                    : '',
                                        }}
                                    >
                                        <ListItemIcon>
                                            <CircleIcon
                                                color={section.bulletColor}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={section.sectionName}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        );
                    })}
                </List>
            </Box>
        </>
    );
}

export default ScorePieChart;
