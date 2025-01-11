import { chromium } from "playwright"
import { isDebug } from "../app.js"
import { prcessBatch1 } from "./batch.js";
import { readExcelFromS3, writeExcelToS3 } from "./aws_s3.js";
import { sendMessage } from "./telegram.js";
import dotenv from 'dotenv'
dotenv.config()

export const errorList = [];

export const Scraper1 = async (townData) => {
    const bucketName = "google-map-scraper-fargate";
    const dataFileName = "townData.xlsx";
    const errorFileName = "errorData.xlsx";
    const tabsPerBatch = 5;
    const s3Data = isDebug ? {} : await readExcelFromS3(bucketName, dataFileName);
    const s3ErrorData = isDebug ? {} : await readExcelFromS3(bucketName, errorFileName);
    const finalData = isDebug ? [] : s3Data.data;
    const errorData = isDebug ? [] : s3ErrorData.data;
    errorData.forEach(error => errorList.push(error));
    const lastIndex = parseInt(process.env.LAST_INDEX, 10);

    const browser = await chromium.launch({ headless: true })

    try {
        console.log("Scraping Started....")
        for (let i = lastIndex; i < townData.length; i += tabsPerBatch) {
            const batch = townData.slice(i, i + tabsPerBatch);
            const res = await prcessBatch1(browser, batch, i + tabsPerBatch);
            res.flat().forEach(data => {
                if ((data.isShopClosed.toLowerCase() !== "permanently closed" || data.isShopClosed.toLowerCase() !== "temporarily closed") && (data.type.toLowerCase() === "auto parts store" || data.type.toLowerCase() === "used auto parts store")) {
                    finalData.push({
                        town: data.town,
                        state: data.state,
                        storeName: data.storeName,
                        address: data.address,
                        website: data.website,
                        phone: data.phone,
                        type: data.type,
                        url: data.link,
                    })
                }
            });

            console.log(`finished index ${i + tabsPerBatch} || lenght: ${finalData.length}`)

            if (isDebug) {
                // await sendMessage(`finished index ${i + tabsPerBatch} || lenght: ${finalData.length}`);
            } else {
                await sendMessage(`finished index ${i + tabsPerBatch} || lenght: ${finalData.length}`);

                if ((i + tabsPerBatch) % 15 === 0) {
                    await writeExcelToS3(bucketName, dataFileName, s3Data.workbook, finalData, s3Data.sheetName);
                }
            }
        }

        if (!isDebug) {
            await sendMessage("Complete Data Scraped");
            await writeExcelToS3(bucketName, dataFileName, s3Data.workbook, finalData, s3Data.sheetName);
            await writeExcelToS3(bucketName, errorFileName, s3ErrorData.workbook, errorList, s3ErrorData.sheetName);
        }
        console.log('Data scraping completed...');
    } catch (error) {
        if (error.message === "max error occured" && !isDebug && finalData.length >= 1000) {
            await writeExcelToS3(bucketName, dataFileName, s3Data.workbook, finalData, s3Data.sheetName);
            await writeExcelToS3(bucketName, errorFileName, s3ErrorData.workbook, errorList, s3ErrorData.sheetName);
        }
        throw error;
    } finally {
        await browser.close();
    }
}