import { Colors } from '@/constants/Colors';
import { formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine, VictoryTooltip, VictoryVoronoiContainer, VictoryZoomContainer } from 'victory-native';

interface CustomBarChartProps {
    data: any,
    x: string,
    y: string,
    renderLabel: (value: string, index?: number) => string[]
}

const CustomBarChart = ({ data, x, y, renderLabel }: CustomBarChartProps) => {

    const { width } = Dimensions.get('window')

    const total = data.reduce((sum, item) => sum + item.avg_calories, 0);
    const average = total / data.length;

    const chartWidth = data.length * 30 + 200

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <VictoryChart
                    domainPadding={{ x: 30 }}
                    padding={{ top: 10, left: 10, bottom: 40, right: 40 }}
                    width={chartWidth > width ? chartWidth : width}
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
                        tickFormat={(v, index) => renderLabel(v, index)}
                    />
                    <VictoryBar
                        data={data}
                        x={x}
                        y={y}
                        style={{
                            data: {
                                fill: Colors.light.primary,
                                width: 30,
                            },
                        }}
                        cornerRadius={{ top: 15, bottom: 15 }}
                        labelComponent={<VictoryTooltip renderInPortal={false} />}
                        labels={({ datum }) => `Value: ${datum.value}`}
                        animate={{ duration: 300 }}
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
            </ScrollView>
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