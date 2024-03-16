import puppeteer from 'puppeteer';

class MermaidValidator {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async setNewPage() {
        const page = await this.browser.newPage();
        return page;
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async setPageContent(mermaidCode) {
        await this.launchBrowser();
         this.page = await this.setNewPage();

        const escapedMermaidCode = mermaidCode.replace(/`/g, '\\`');

        await this.page.setContent(`
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

    async validate(mermaidCode) {

        await this.setPageContent(mermaidCode);

        const validationResult = await this.page.evaluate(() => document.body.innerText);

        const isMermaidSyntaxValid = validationResult === 'true';

        await this.closeBrowser();

        return isMermaidSyntaxValid;
    }
}

export default MermaidValidator;