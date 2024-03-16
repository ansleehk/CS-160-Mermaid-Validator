import express, { Request, Response } from 'express';
import MermaidValidator from './validator.js';

const app = express();
export const PORT = 8080;


app.use(express.json());

app.use('/lib', express.static('./lib'));

app.post('/validate-mermaid', async (req: Request, res: Response) => {
    try {
        const { mermaidCode } = req.body;
        if (!mermaidCode) {
            return res.status(400).send({ error: 'Mermaid code is required.' });
        }

        const validator = await MermaidValidator.getInstance();
        const isValid = await validator.validate(mermaidCode);

        res.send({ isValid });
        
    } catch (error) {
        console.error('Error validating Mermaid syntax:', error);
        res.status(500).send({ error: 'Failed to validate Mermaid syntax.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});