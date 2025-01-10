import * as cheerio from "cheerio";
import { autoScroll_1 } from "./autoScroll.js";

export const processPages = async (browser, townList) => {
    const page = await browser.newPage();
    try {
        const searchQuery = `auto parts store in ${townList.town}, ${townList.state}, USA`;

        await page.goto(`https://www.google.com/maps/search/${searchQuery.split(" ").join("+")}?hl=en`, { timeout: 60000 });

        await page.waitForSelector("body", { timeout: 60000 });

        return page;
    } catch (error) {
        await page.close();
        return null;
    }
}

export const processData1 = async (page, townData) => {
    try {
        const resultCheck = await page.$('div[role="feed"]')

        if (resultCheck) {
            await autoScroll_1(page);

            const html = await page.content();
            const $ = cheerio.load(html);

            const shopElements = $(".Nv2PK.THOPZb.CpccDe");

            const shopData = shopElements.map((index, data) => {
                const tempData = [];
                const shopName = $(data).find('div.fontBodyMedium > div').first().text() || "";
                const shopLink = $(data).find('a.hfpxzc').first().attr('href');
                const shopCheck = $(data).find('div.W4Efsd:nth-of-type(2) > span')?.first().text() || "";
                const shopType = $(data).find('div.W4Efsd:nth-of-type(1) > span')?.first().text() || "";

                tempData.push({
                    town: townData.town.trim(),
                    state: townData.state,
                    storeName: shopName,
                    address: "",
                    website: "",
                    phone: "",
                    type: shopType,
                    isShopClosed: shopCheck,
                    link: shopLink.split("?")[0],
                });

                return tempData;
            }).get();
            return shopData;
        } else {
            const html = await page.content();
            const $ = cheerio.load(html);

            const shopName = $("h1.DUwDvf.lfPIob").first().text().trim() || "";
            const shopAddress = $(".Io6YTe.fontBodyMedium.kR99db.fdkmkc").first().text().trim() || "";
            let shopWebsite = $("a.CsEnBe").first().attr("href") || "";
            const shopPhone = $(`button.CsEnBe[data-tooltip="Copy phone number"] .Io6YTe.fontBodyMedium.kR99db.fdkmkc`).first().text() || "";
            const checkWebsite = shopWebsite.includes("business.google.com");
            const isNotice = $('span.LT79uc.google-symbols').first().attr("aria-label") || "";
            const shopType = $("button.DkEaL").first().text() || "";
            const shopUrl = page.url();

            if (checkWebsite) {
                shopWebsite = "";
            }
            return [{ town: townData.town, state: townData.state, storeName: shopName, address: shopAddress, website: shopWebsite, phone: shopPhone, type: shopType, isShopClosed: isNotice, link: shopUrl }]
        }

    } catch (error) {
        throw error;
    } finally {
        if (page) {
            await page.close();
        }
    }
}

export const processDataTest = async (browser, townData) => {
    const page = await browser.newPage();
    try {
        const searchQuery = `auto parts store in ${townData.town}, ${townData.state}, USA`;

        await page.goto(`https://www.google.com/maps/search/${searchQuery.split(" ").join("+")}?hl=en`, { timeout: 60000 });

        await page.waitForSelector("body", { timeout: 60000 });

        const resultCheck = await page.$('div[role="feed"]')

        if (resultCheck) {
            await autoScroll_1(page);

            const html = await page.content();
            const $ = cheerio.load(html);

            const shopElements = $(".Nv2PK.THOPZb.CpccDe");

            const shopData = shopElements.map((index, data) => {
                const tempData = [];
                const shopName = $(data).find('div.fontBodyMedium > div').first().text() || "";
                const shopLink = $(data).find('a.hfpxzc').first().attr('href');
                const shopCheck = $(data).find('div.W4Efsd:nth-of-type(2) > span')?.first().text() || "";
                const shopType = $(data).find('div.W4Efsd:nth-of-type(1) > span')?.first().text() || "";

                tempData.push({
                    town: townData.town.trim(),
                    state: townData.state,
                    storeName: shopName,
                    address: "",
                    website: "",
                    phone: "",
                    type: shopType,
                    isShopClosed: shopCheck,
                    link: shopLink.split("?")[0],
                });

                return tempData;
            }).get();
            return shopData;
        } else {
            const html = await page.content();
            const $ = cheerio.load(html);

            const shopName = $("h1.DUwDvf.lfPIob").first().text().trim() || "";
            const shopAddress = $(".Io6YTe.fontBodyMedium.kR99db.fdkmkc").first().text().trim() || "";
            let shopWebsite = $("a.CsEnBe").first().attr("href") || "";
            const shopPhone = $(`button.CsEnBe[data-tooltip="Copy phone number"] .Io6YTe.fontBodyMedium.kR99db.fdkmkc`).first().text() || "";
            const checkWebsite = shopWebsite.includes("business.google.com");
            const isNotice = $('span.LT79uc.google-symbols').first().attr("aria-label") || "";
            const shopType = $("button.DkEaL").first().text() || "";
            const shopUrl = page.url();

            if (checkWebsite) {
                shopWebsite = "";
            }
            return [{ town: townData.town, state: townData.state, storeName: shopName, address: shopAddress, website: shopWebsite, phone: shopPhone, type: shopType, isShopClosed: isNotice, link: shopUrl }]
        }
    } catch (error) {
        console.log(`Error at ${townData.town} | ${townData.state}`)
        throw error;
    } finally {
        if (page) {
            await page.close();
        }
    }
}