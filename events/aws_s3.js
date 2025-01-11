import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import XLSX from 'xlsx';
import { sendMessage } from './telegram';

const s3Client = new S3Client({ region: "us-east-1" });

export const streamToBuffer = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
};

export const readExcelFromS3 = async (bucketName, fileName) => {
    try {
        const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
        const response = await s3Client.send(command);

        const fileBuffer = await streamToBuffer(response.Body);
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);

        return { workbook, sheetName, data };
    } catch (error) {
        console.error("Error reading Excel file:", error);
        throw error;
    }
};

export const writeExcelToS3 = async (bucketName, fileName, workbook, newData, sheetName) => {
    try {
        const newSheet = XLSX.utils.json_to_sheet(newData);
        workbook.Sheets[sheetName] = newSheet;

        const fileBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        await s3Client.send(command);
        console.log(`${fileName} successfully updated on S3.`);
        await sendMessage(`${fileName} updated in S3`)
    } catch (error) {
        console.error("Error writing Excel file:", error);
        throw error;
    }
};