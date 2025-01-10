import { processData1, processDataTest, processPages } from "./dataProcess.js";

export const prcessBatch1 = async (browser, batch) => {
    try {
        // const pages = await Promise.all(
        //     batch.map(async (data) => await processPages(browser, data))
        // )


        // const successfulPages = pages.filter(page => page !== null);

        // const result = [];
        // for (let i = 0; i < successfulPages.length; i++) {
        //     try {
        //         const res = await processData1(successfulPages[i], batch[i]);
        //         result.push(res)
        //     } catch (error) {
        //         throw error
        //     }
        // }

        const data = await Promise.all(
            batch.map(async (data) => await processDataTest(browser, data))
        )

        return data;
    } catch (error) {
        throw error;
    }
}