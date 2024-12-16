import { Colors } from '@/constants/Colors';
import { formatDateStripToSlash, formatDateToDay } from '@/utils/formatDatetoString';
import { formatDecimalToFixed } from '@/utils/formatNumber';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine, VictoryTooltip, VictoryVoronoiContainer, VictoryZoomContainer, VictoryTheme } from 'victory-native';

interface CustomBarChartProps {
    data: any,
    x: string,
    y: string,
    average: number,
    renderLabel: (value: string, index?: number) => string[]
}

const CustomBarChart = ({ data, x, y, average, renderLabel }: CustomBarChartProps) => {

    const { width } = Dimensions.get('window')

    return (
        <View style={styles.container}>
            <VictoryChart
                domainPadding={20}
                padding={{ left: 10, top: 10, right: 40, bottom: 40 }}
                width={width}
                containerComponent={
                    <VictoryZoomContainer
                        zoomDimension='x'
                        zoomDomain={data.length > 10 ? { x: [0, 10] } : undefined}
                    />
                }
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
                    cornerRadius={{ top: 5, bottom: 5 }}
                // labelComponent={<VictoryTooltip
                //     renderInPortal={false}
                //     constrainToVisibleArea
                // />}
                // labels={({ datum }) => formatDecimalToFixed(datum[y])}
                />
                <VictoryLine
                    y={() => average}
                    style={{
                        data: {
                            stroke: Colors.light.secondary,
                            strokeDasharray: '4,4'
                        },
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