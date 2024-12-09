import { resolveTimingColor } from "./resolver";

const generateHtml = (datas: GetLogReportByDateRes[], options: { [key: string]: boolean }, userProfile: any, startDate: string, endDate: string) => {
    // Get average 
    let avg = { calories: '', burned_calories: '', glucose_rate: '' }

    let total = datas.reduce((acc, data) => {
        acc.calories += data.avg_calories ?? 0
        acc.burned_calories += data.avg_burned_calories ?? 0
        acc.glucose_rate += data.avg_glucose_rate ?? 0
        return acc
    }, { calories: 0, burned_calories: 0, glucose_rate: 0 })

    avg.calories = Number(total.calories / datas.filter(data => data.avg_calories != 0).length).toFixed(2)
    avg.burned_calories = Number(total.burned_calories / datas.filter(data => data.avg_burned_calories != 0).length).toFixed(2)
    avg.glucose_rate = Number(total.glucose_rate / datas.filter(data => data.avg_glucose_rate != 0).length).toFixed(2)

    return `
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
                        <td style="font-weight: bold;">${userProfile.firstname} ${userProfile.lastname}</td>
                        <td>Riwayat Penyakit</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.medical_history}</td>
                        </tr>
                        <tr>
                        <td>Usia</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.age}</td>
                        <td>Keturunan Diabetes</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.is_descendant_diabetes}</td>
                        </tr>
                        <tr>
                        <td>Berat Badan</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.weight}</td>
                        <td>Tipe Diabetes</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.diabetes_type}</td>
                        </tr>
                        <tr>
                        <td>Tinggi Badan</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.height}</td>
                        </tr>
                        <tr>
                        <td>Jenis Kelamin</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${userProfile.gender}</td>
                        <td>Data Diambil</td>
                        <td>:</td>
                        <td style="font-weight: bold;">${startDate} - ${endDate}</td>
                        </tr>
                    </tbody>
                </table>

                <table style="border-collapse: collapse; margin-bottom: 10px;">
                    <colgroup>
                        <col style="width: 16%;" />
                        <col style="width: 16%;" />
                        <col style="width: 16%;" />
                        <col style="width: 16%;" />
                        <col style="width: 16%;" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th style="border: 1px solid black; font-weight: bold" colSpan="2">Hari dan Waktu</th>
                            ${options.glucose_log ? `<th style="border: 1px solid black; font-weight: bold">Gula Darah (mg/dL)</th>` : ``}
                            ${options.food_log ? `<th style="border: 1px solid black; font-weight: bold">Kalori Nutrisi (Kkal)</th>` : ``}
                            ${options.exercise_log ? `<th style="border: 1px solid black; font-weight: bold">Aktivitas Fisik (Kkal)</th>` : ``}
                            ${options.medicine_log ? `<th style="border: 1px solid black; font-weight: bold">Konsumsi Obat</th>` : ``}
                        </tr>
                    </thead>
                    <tbody>
                        ${datas.map(data => `
                        <tr>
                            ${data.description === 'pagi' ? `<td style="border: 1px solid black;" rowSpan="5">${data.date}</td>` : ''}
                            <td style="border: 1px solid black;background-color: ${resolveTimingColor(data.description)}">${data.description}</td>
                            ${options.glucose_log ? `<td style="border: 1px solid black;background-color: ${resolveTimingColor(data.description)}">${data.avg_glucose_rate}</td>` : ``}
                            ${options.food_log ? `<td style="border: 1px solid black;background-color: ${resolveTimingColor(data.description)}">${data.avg_calories}</td>` : ``}
                            ${options.exercise_log ? `<td style="border: 1px solid black;background-color: ${resolveTimingColor(data.description)}">${data.avg_burned_calories}</td>` : ``}
                            ${options.medicine_log ? `<td style="border: 1px solid black;background-color: ${resolveTimingColor(data.description)}">${data.medicine_details}</td>` : ``}
                        </tr>
                        `).join('')}
                        <tr>
                            <td style="border: 1px solid black; font-weight: bold;" colSpan="2">Rata-rata</td>
                            ${options.glucose_log ? `<td style="border: 1px solid black; font-weight: bold;">${avg.glucose_rate}</td>` : ``}
                            ${options.food_log ? `<td style="border: 1px solid black; font-weight: bold;">${avg.calories}</td>` : ``}
                            ${options.exercise_log ? `<td style="border: 1px solid black; font-weight: bold;">${avg.burned_calories}</td>` : ``}
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
                        <td style="border: 1px solid black;background-color: ${resolveTimingColor('pagi')}">Pagi</td>
                        <td style="border: 1px solid black;">Berkisar jam 05.00 - 09.59</td>
                        </tr>
                        <tr>
                        <td style="border: 1px solid black;;background-color: ${resolveTimingColor('siang')}">Siang</td>
                        <td style="border: 1px solid black;">Berkisar jam 10.00 - 14.59</td>
                        </tr>
                        <tr>
                        <td style="border: 1px solid black;;background-color: ${resolveTimingColor('sore')}">Sore</td>
                        <td style="border: 1px solid black;">Berkisar jam 15.00 - 17.59</td>
                        </tr>
                        <tr>
                        <td style="border: 1px solid black;;background-color: ${resolveTimingColor('malam')}">Malam</td>
                        <td style="border: 1px solid black;">Berkisar jam 18.00 - 21.59</td>
                        </tr>
                        <tr>
                        <td style="border: 1px solid black;;background-color: ${resolveTimingColor('waktu tidur')}">Waktu Tidur</td>
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
    `
};

export default generateHtml