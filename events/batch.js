import { processData1 } from "./dataProcess.js";

export const prcessBatch1 = async (browser, batch, index) => {
    try {
        const data = await Promise.all(
            batch.map(async (data, i) => await processData1(browser, data, index, i))
        )

        const errorData = data.filter(data => data === null)
        if (errorData.length >= 5) {
            throw new Error("max error occured")
        }

        const filtredData = data.filter(data => data !== null)
        return filtredData;
    } catch (error) {
        throw error;
    }
}