
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export async function downloadPdf(html: any) {
    try {
        // 1. Generate PDF
        const { uri: pdfUri } = await Print.printToFileAsync({
            html: html,
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

export async function sharePdf(html: any) {
    const { uri: pdfUri } = await Print.printToFileAsync({
        html: html,
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