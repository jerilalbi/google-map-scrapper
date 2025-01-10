export const autoScroll_1 = async (page) => {
    try {
        await page.evaluate(async () => {
            const wrapper = document.querySelector('div[role="feed"]');
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 1000;
                let scrollDelay = 3000;

                let timer = setInterval(async () => {
                    let scrollHeightBefore = wrapper.scrollHeight;
                    wrapper.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeightBefore) {
                        totalHeight = 0;
                        await new Promise((resolve) => setTimeout(resolve, scrollDelay));

                        const scrollHeightAfter = wrapper.scrollHeight;

                        if (scrollHeightAfter > scrollHeightBefore) {
                            return;
                        } else {
                            clearInterval(timer);
                            resolve();
                        }
                    }
                }, 500);
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}