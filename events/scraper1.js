import { chromium } from "playwright"
import { isDebug } from "../app.js"
import { prcessBatch1 } from "./batch.js";

export const Scraper1 = async (townData) => {

    const tabsPerBatch = 5;
    const finalData = [];

    const browser = isDebug ?
        await chromium.launch({ headless: true }) :
        await chromium.launch({ headless: true })

    try {

        for (let i = 0; i < townData.length; i += tabsPerBatch) {
            try {
                const batch = townData.slice(i, i + tabsPerBatch);
                const res = await prcessBatch1(browser, batch);
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
                console.log(`finished index ${i + tabsPerBatch} || lenght: ${finalData.length} ${new Date().toLocaleTimeString('en-US', { hour12: false })}`)
            } catch (error) {
                throw error;
            }
        }

    } catch (error) {
        throw error;
    } finally {
        await browser.close();
    }

}