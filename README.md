# Running the application

## Docker
> [!NOTE]
> Running on ARM is not supported.
```
git clone https://github.com/ansleehk/CS-160-Mermaid-Validator.git
cd CS-160-Mermaid-Validator
docker build . -t cs-160/mermaid-validator
docker run -p 8080:8080 cs-160/mermaid-validator
```
