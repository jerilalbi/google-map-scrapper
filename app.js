import { readExcel } from "./events/fileProcess.js";
import { Scraper1 } from "./events/scraper1.js";

export const isDebug = false;

(async () => {
    try {
        const baseData = await readExcel("full_townlist.xlsx");
        await Scraper1(baseData);
    } catch (error) {
        console.log(error.message)
    }
})()