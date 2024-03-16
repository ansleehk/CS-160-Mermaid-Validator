import express from 'express';
import MermaidValidator from './validator.js';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/validate-mermaid', async (req, res) => {
    try {
        const { mermaidCode } = req.body;
        if (!mermaidCode) {
            return res.status(400).send({ error: 'Mermaid code is required.' });
        }

        const validator = new MermaidValidator();
        const isValid = await validator.validate(mermaidCode);

        res.send({ isValid });
        
    } catch (error) {
        console.error('Error validating Mermaid syntax:', error);
        res.status(500).send({ error: 'Failed to validate Mermaid syntax.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});