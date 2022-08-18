import CircleIcon from '@mui/icons-material/Circle';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { PieChartDataType } from '@Type/Quiz';
import { useMemo, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
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
    numberSkippedQuestions: number;
};
function ScorePieChart(props: ScorePieChartProps) {
    const {
        numberOfRightAnswers,
        numberOfWrongAnswers,
        numberSkippedQuestions,
    } = props;
    const [
        currentSelectedSectionOfPieChart,
        setCurrentSelectedSectionOfPieChart,
    ] = useState<number | undefined>(undefined);
    const currentSelectedSectionOfPieChartHandler = (index: number) => {
        setCurrentSelectedSectionOfPieChart(
            index === currentSelectedSectionOfPieChart ? undefined : index
        );
    };
    const totalNumberOfQuestions = useMemo(() => {
        return (
            numberOfRightAnswers + numberOfWrongAnswers + numberSkippedQuestions
        );
    }, [numberOfRightAnswers, numberOfWrongAnswers, numberSkippedQuestions]);
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <PieChart
                data={getDataForPieChart(
                    numberOfRightAnswers,
                    numberOfWrongAnswers,
                    numberSkippedQuestions
                )}
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
                    if (
                        section.sectionName === 'CORRECT' &&
                        numberOfRightAnswers === 0
                    )
                        return null;
                    else if (
                        section.sectionName === 'WRONG' &&
                        numberOfWrongAnswers === 0
                    )
                        return null;
                    if (
                        section.sectionName === 'SKIPPED' &&
                        numberSkippedQuestions === 0
                    )
                        return null;
                    return (
                        <ListItem
                            sx={{
                                display: 'list-item',
                            }}
                            key={section.sectionName}
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
                                    <CircleIcon color={section.bulletColor} />
                                </ListItemIcon>
                                <ListItemText primary={section.sectionName} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

export default ScorePieChart;

function getDataForPieChart(
    numberOfRightAnswers: number,
    numberOfWrongAnswers: number,
    numberSkippedQuestions: number
) {
    const dataForPieChart = [] as Array<PieChartDataType>;
    if (numberOfRightAnswers > 0)
        dataForPieChart.push({
            title: 'Correct',
            value: numberOfRightAnswers,
            color: '#2e7d32',
        });
    if (numberOfWrongAnswers > 0)
        dataForPieChart.push({
            title: 'Wrong',
            value: numberOfWrongAnswers,
            color: '#d32f2f',
        });
    if (numberSkippedQuestions > 0)
        dataForPieChart.push({
            title: 'Skipped',
            value: numberSkippedQuestions,
            color: '#7D7D7D',
        });
    return dataForPieChart;
}
