import { View, Text, Modal, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useSession } from '../context/AuthenticationProvider'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const generateHtml = (datas: any) => `
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body>
            <div style="background-color: white;">
                <h1 style="text-align: center;">Hasil Laporan Kesehatan</h1>
                <table style="margin-bottom: 10px;">
                <colgroup>
                    <col style="width: 16%;" />
                    <col style="width: 2%;" />
                    <col style="width: 16%;" />
                    <col style="width: 16%;" />
                    <col style="width: 2%;" />
                    <col style="width: 16%;" />
                </colgroup>
                <tbody>
                    <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td style="font-weight: bold;">Nicholas Audric</td>
                    <td>Riwayat Penyakit</td>
                    <td>:</td>
                    <td style="font-weight: bold;">Tidak Ada</td>
                    </tr>
                    <tr>
                    <td>Usia</td>
                    <td>:</td>
                    <td style="font-weight: bold;">24 Tahun</td>
                    <td>Keturunan Diabetes</td>
                    <td>:</td>
                    <td style="font-weight: bold;">Tidak Ada</td>
                    </tr>
                    <tr>
                    <td>Berat Badan</td>
                    <td>:</td>
                    <td style="font-weight: bold;">78 Kg</td>
                    <td>Tipe Diabetes</td>
                    <td>:</td>
                    <td style="font-weight: bold;">Non-diabetes</td>
                    </tr>
                    <tr>
                    <td>Tinggi Badan</td>
                    <td>:</td>
                    <td style="font-weight: bold;">165 Cm</td>
                    </tr>
                    <tr>
                    <td>Jenis Kelamin</td>
                    <td>:</td>
                    <td style="font-weight: bold;">Pria</td>
                    <td>Data Diambil</td>
                    <td>:</td>
                    <td style="font-weight: bold;">01/06/2024 - 07/06/2024</td>
                    </tr>
                </tbody>
                </table>

                <table style="border: 1px solid black; border-collapse: collapse; margin-bottom: 10px;">
                <colgroup>
                    <col style="width: 16%;" />
                    <col style="width: 16%;" />
                    <col style="width: 16%;" />
                    <col style="width: 16%;" />
                    <col style="width: 16%;" />
                </colgroup>
                <thead>
                    <tr>
                    <th colSpan="2">Hari dan Waktu</th>
                    <th>Gula Darah (mg/dL)</th>
                    <th>Kalori Nutrisi (Kal)</th>
                    <th>Aktivitas Fisik (Kal)</th>
                    <th>Konsumsi Obat</th>
                    </tr>
                </thead>
                <tbody>
                    ${datas.map(data => `
                    <tr>
                        ${data.description === 'pagi' ? `<td style="border: 1px solid black;" rowSpan="5">${data.date}</td>` : ''}
                        <td style="border: 1px solid black;">${data.description}</td>
                        <td style="border: 1px solid black;">${data.avg_glucose_rate}</td>
                        <td style="border: 1px solid black;">${data.avg_calories}</td>
                        <td style="border: 1px solid black;">${data.avg_burned_calories}</td>
                        <td style="border: 1px solid black;">${data.medicine_details}</td>
                    </tr>
                    `).join('')}
                    <tr>
                    <td style="border: 1px solid black; font-weight: bold;" colSpan="2">Rata-rata</td>
                    <td style="border: 1px solid black; font-weight: bold;">100</td>
                    <td style="border: 1px solid black; font-weight: bold;">100</td>
                    <td style="border: 1px solid black; font-weight: bold;">100</td>
                    </tr>
                </tbody>
                </table>

                <table style="border-collapse: collapse; margin-bottom: 10px;">
                <thead>
                    <tr>
                    <th style="border: 1px solid black;">Keterangan:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td style="border: 1px solid black;">Pagi</td>
                    <td style="border: 1px solid black;">Berkisar jam 05.00 - 09.59</td>
                    </tr>
                    <tr>
                    <td style="border: 1px solid black;">Siang</td>
                    <td style="border: 1px solid black;">Berkisar jam 10.00 - 14.59</td>
                    </tr>
                    <tr>
                    <td style="border: 1px solid black;">Sore</td>
                    <td style="border: 1px solid black;">Berkisar jam 15.00 - 17.59</td>
                    </tr>
                    <tr>
                    <td style="border: 1px solid black;">Malam</td>
                    <td style="border: 1px solid black;">Berkisar jam 18.00 - 21.59</td>
                    </tr>
                    <tr>
                    <td style="border: 1px solid black;">Waktu Tidur</td>
                    <td style="border: 1px solid black;">Berkisar jam 22.00 - 04.59</td>
                    </tr>
                </tbody>
                </table>

                <div style="width: 100%; text-align: center;">
                Sebagai catatan: Laporan ini dikeluarkan oleh aplikasi Glublood dan dapat ditunjukkan laporan ini untuk dianalisis pada dokter yang berkaitan dengan diabetes ataupun ahli gizi.
                </div>
            </div>
        </body>
    </html>
`;

const datas = [
    {
        "date": "2024-10-20",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-20",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-20",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-20",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-20",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-21",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-21",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-21",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-21",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-21",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-22",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-22",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-22",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-22",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-22",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-23",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-23",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-23",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-23",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-23",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-24",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-24",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-24",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-24",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-24",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-25",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-25",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-25",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-25",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-25",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-26",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-26",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-26",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-26",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-26",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    },
    {
        "date": "2024-10-27",
        "description": "pagi",
        "avg_calories": 424.81,
        "avg_burned_calories": 529.7,
        "avg_glucose_rate": 72.56,
        "medicine_details": "   + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Panadol + 2 Dosis Promaag + 2 Kapsul Panadol + 2 Pil Insulin + 3 Kapsul Insulin + 3 Pil Insulin + 3 Pil Panadol"
    },
    {
        "date": "2024-10-27",
        "description": "siang",
        "avg_calories": 505.92,
        "avg_burned_calories": 504.72,
        "avg_glucose_rate": 77.46,
        "medicine_details": "   + 1 Dosis Panadol + 1 Pil Insulin + 2 Dosis Insulin + 2 Dosis Promaag + 2 Kapsul Insulin + 2 Pil Promaag + 3 Kapsul Insulin + 3 Kapsul Panadol + 3 Kapsul Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-27",
        "description": "sore",
        "avg_calories": 485.63,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 131.5,
        "medicine_details": "   + 1 Dosis Insulin + 1 Dosis Panadol + 2 Dosis Insulin + 2 Dosis Panadol + 3 Dosis Panadol + 3 Dosis Promaag + 3 Pil Insulin + 3 Pil Promaag"
    },
    {
        "date": "2024-10-27",
        "description": "malam",
        "avg_calories": 576.94,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 90.65,
        "medicine_details": "   + 1 Dosis Panadol + 1 Dosis Promaag + 1 Kapsul Panadol + 1 Kapsul Promaag"
    },
    {
        "date": "2024-10-27",
        "description": "waktu tidur",
        "avg_calories": 435.3,
        "avg_burned_calories": 0,
        "avg_glucose_rate": 142.2,
        "medicine_details": "   + 1 Kapsul Promaag + 2 Pil Promaag + 3 Pil Insulin"
    }
]


export default function index() {
    const { signOut, session } = useSession()

    const [modal, setModal] = useState(false)

    const handleShare = async () => {
        const { uri: pdfUri } = await Print.printToFileAsync({
            html: generateHtml(datas),
            margins: {
                top: 16,
                right: 16,
                bottom: 16,
                left: 16,
            }
        });
        console.log('File has been saved to:', pdfUri);

        await shareAsync(pdfUri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    const handleDownload = async () => {
        try {
            // 1. Generate PDF
            const { uri: pdfUri } = await Print.printToFileAsync({
                html: generateHtml(datas),
                margins: {
                    top: 16,
                    right: 16,
                    bottom: 16,
                    left: 16,
                }
            });

            // 2. Convert PDF to base64
            const pdfBase64 = await FileSystem.readAsStringAsync(pdfUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // 3. Request permission access to local storage
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (!permissions.granted) {
                alert('Permission to access storage was denied');
                return;
            }

            const directoryUri = permissions.directoryUri;
            const fileName = 'Hasil_Laporan_Kesehatan.pdf'; // TODO: Generate file name 

            // 4. Save file to local storage
            try {
                await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, 'application/pdf')
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });
                        alert(`File has been saved to ${uri}`);
                    })
                    .catch((e) => {
                        throw e
                    });
            } catch (e) {
                throw e
            }
        } catch (error) {
            console.error('Error generating or saving PDF:', error);
            alert('Failed to save the PDF. Please try again.');
        }
    }

    return (
        <>
            <Modal
                animationType="slide"
                visible={modal}
                transparent={true}
            >
                <View className='flex-1 flex-col justify-end'>
                    <View style={{
                        height: 300,
                        backgroundColor: 'white'
                    }}>
                        <CustomButton title='modal' onPress={() => setModal(!modal)} />
                    </View>
                </View>
            </Modal>
            <View>
                <CustomButton title='Sign out' onPress={() => signOut()} />
                <CustomButton title='modal' onPress={() => setModal(!modal)} />
                <CustomButton title='download' onPress={handleDownload} />
                <CustomButton title='share' onPress={handleShare} />
                <CustomButton title='report' onPress={() => router.push('/report')} />
                <CustomButton title='menu' onPress={() => router.push('/food-menus')} />
            </View>
        </>
    )
}

