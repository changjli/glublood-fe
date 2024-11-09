import { Colors } from '@/constants/Colors';
import { formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine, VictoryTooltip, VictoryLabel } from 'victory-native';

const CustomBarChart = ({ data }) => {

    const total = data.reduce((sum, item) => sum + item.avg_calories, 0);
    const average = total / data.length;

    return (
        <View style={styles.container}>
            <VictoryChart
                domainPadding={{ x: 30 }}
                padding={{ top: 10, left: 10, bottom: 40, right: 40 }}
            >
                <VictoryAxis
                    dependentAxis
                    orientation='right'
                    style={{
                        axis: { stroke: Colors.light.gray200 },
                        grid: { stroke: Colors.light.gray200, strokeWidth: 1.5 },
                        tickLabels: {
                            fontSize: 12,
                        },
                    }}
                />
                <VictoryAxis
                    style={{
                        axis: { stroke: Colors.light.gray200 },
                        grid: { stroke: Colors.light.gray200, strokeWidth: 1.5 },
                        tickLabels: {
                            fontSize: 12,
                        },
                        // axis: { stroke: "transparent" },
                        // ticks: { stroke: "transparent" },
                        // tickLabels: { fill: "transparent" }
                    }}
                    tickFormat={(v) => [formatDateStripToSlash(v), formatDateToDay(v)]}
                />
                <VictoryBar
                    data={data}
                    x="date"
                    y="avg_calories"
                    style={{
                        data: {
                            fill: Colors.light.primary,
                        },
                    }}
                    cornerRadius={{
                        top: 15,
                        bottom: 15
                    }}
                    barRatio={1}
                    labelComponent={<VictoryTooltip />}
                    labels={({ datum }) => `Value: ${datum.value}`}
                    animate={{ duration: 500 }}
                />
                <VictoryLine
                    y={() => average} // Position line at the average value
                    style={{
                        data: {
                            stroke: Colors.light.secondary,
                            strokeDasharray: '4,4'
                        }, // Dashed line for average
                    }}
                />
            </VictoryChart>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    labelItem: {
        alignItems: 'center',
    },
    dayText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 10,
        color: 'grey',
    },
});

export default CustomBarChart;