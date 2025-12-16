# LibreOffice Setup for DOCX to PDF Conversion

This project uses **LibreOffice** to convert DOCX files to PDF while preserving all formatting, colors, styles, and images.

## Installation Instructions

### Windows (Local Development)

1. Download LibreOffice from: https://www.libreoffice.org/download
2. Install with default settings to `C:\Program Files\LibreOffice\`
3. Verify installation:
   ```powershell
   "C:\Program Files\LibreOffice\program\soffice.exe" --version
   ```

**Alternative:** If installed in a different location, update the path in [src/services/generator/pdf/generate.service.ts](src/services/generator/pdf/generate.service.ts#L29)

### macOS (Local Development)

```bash
# Using Homebrew
brew install --cask libreoffice

# Verify installation
libreoffice --version
```

### Linux (Local Development)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install libreoffice libreoffice-writer

# Fedora/RHEL
sudo dnf install libreoffice libreoffice-writer

# Verify installation
libreoffice --version
```

## Docker Setup

LibreOffice is **automatically installed** in Docker containers via the Dockerfiles:

- **Development:** [docker/Dockerfile.dev](docker/Dockerfile.dev)
- **Production:** [docker/Dockerfile.prod](docker/Dockerfile.prod)

No additional configuration needed for Docker environments.

## Production Deployment

### Cloud Platforms

**AWS EC2 / Azure VM / GCP Compute:**

```bash
# Install LibreOffice on the server
sudo apt-get update && sudo apt-get install -y libreoffice libreoffice-writer
```

**Docker/Kubernetes:**

- No action required - LibreOffice is included in the Docker image

**Serverless (AWS Lambda, Google Cloud Functions):**

- Use a Lambda Layer with LibreOffice pre-installed
- Example: https://github.com/shelfio/libreoffice-lambda-layer

## Verification

Test the conversion:

```bash
# Run the server
npm run dev

# Generate a PDF document using the API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d @examples/text/text_data.json
```

If you see errors about `soffice` or `libreoffice` not found, ensure:

1. LibreOffice is installed
2. The executable is in your system PATH
3. For Windows, the path in `generate.service.ts` matches your installation location
