import puppeteer, { Browser, Page } from 'puppeteer';

class MermaidValidator {

    private browser: Browser | null = null;

    private static instance: MermaidValidator;
    

    /**
     * Singleton class to validate Mermaid syntax using Puppeteer
     */
    private constructor() {
        

    }

    private async launchBrowser(): Promise<void> {
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

    }

    private async createNewPage(): Promise<Page>{
        if (!this.browser) {
            throw new Error('Browser not available');
        }

        const page = await this.browser.newPage();

        return page;
    }

    private async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    private async setPageContent(page: Page, mermaidCode: string): Promise<void> {

        const escapedMermaidCode = mermaidCode.replace(/`/g, '\\`');

        await page.setContent(`
            <html>
                <body>
                    <script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
                    <script>
                    async function parseMermaid() {
                        try {
                            await mermaid.parse(\`${escapedMermaidCode}\`);
                            document.body.innerHTML = '<div>true</div>';
                        } catch (error) {
                            document.body.innerHTML = '<div>false</div>';
                        }
                    }
                    document.addEventListener('DOMContentLoaded', parseMermaid);
                    </script>
                </body>
            </html>
        `, { waitUntil: 'networkidle0' });
    }

    public static async getInstance(){
        if (!MermaidValidator.instance) {
            MermaidValidator.instance = new MermaidValidator();
            await MermaidValidator.instance.launchBrowser();

        }
        return MermaidValidator.instance;
    }

    public async validate(mermaidCode: string) {

        const page: Page = await this.createNewPage();

        await this.setPageContent(page, mermaidCode);

        const validationResult = await page.evaluate(() => document.body.innerText);

        const isMermaidSyntaxValid = validationResult === 'true';

        await page.close();

        return isMermaidSyntaxValid;
    }
}

export default MermaidValidator;