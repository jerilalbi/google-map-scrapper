import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_API);
const chatID = 2012577821;

export const sendMessage = async (msg) => {
    try {
        await bot.sendMessage(chatID, msg);
    } catch (error) {
        console.error(error);
    }
}