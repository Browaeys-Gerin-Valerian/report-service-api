# 📘 Report Service API

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-24+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-ISC-yellow)

A RESTful API service built with Node.js, Express, TypeScript, and MongoDB for managing document templates and generating customized reports (DOCX/PDF) from structured data.

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Templates File Storage](#-templates-file-storage)
- [Prerequisites](#-prérequis)
- [Installation](#-installation)
- [Running with Docker](#-running-the-containers)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Business Rules](#-business-rules)
- [XLSX Template Data Mapping](#-xlsx-template-data-mapping)

## 🎯 Overview

This service provides a complete solution for:

- **Blueprint Management**: Define reusable data structure schemas
- **Template Management**: Upload and manage DOCX templates with placeholders
- **Template Analysis**: Automatically detect missing or unused placeholders
- **Document Generation**: Generate DOCX or PDF documents by merging templates with data
- **Validation**: Comprehensive validation of data against blueprints using Zod schemas

## ✨ Key Features

- 📝 **Dynamic Template Processing**: Uses `docx-templates` for advanced template manipulation
- 🔍 **Placeholder Analysis**: Automatically identifies present, absent, and non-existent placeholders
- 📄 **Multiple Output Formats**: Generate DOCX or convert to PDF using LibreOffice
- 🎨 **Image Support**: Inject images with customizable dimensions and presets
- ✅ **Data Validation**: Validate user data against blueprint schemas with detailed error reporting
- 🗂️ **File Management**: Automatic template file storage and cleanup
- 🔒 **Type Safety**: Full TypeScript implementation with strict typing
- 🧪 **Comprehensive Testing**: Jest-based test suite
- 🐳 **Docker Support**: Ready-to-deploy with development and production configurations

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js 24+
- **Framework**: Express 5
- **Language**: TypeScript 5
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schemas
- **Testing**: Jest with Supertest
- **Documentation**: OpenAPI 3.1 / Swagger UI
- **Template Engine**: docx-templates
- **PDF Conversion**: LibreOffice (headless)

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@config/*` → `src/config/*`
- `@controllers/*` → `src/controllers/*`
- `@middlewares/*` → `src/middlewares/*`
- `@models/*` → `src/models/*`
- `@router/*` → `src/router/*`
- `@services/*` → `src/services/*`
- `@tests/*` → `src/tests/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`
- `@custom_types/*` → `src/types/*`

## 📄 Templates File Storage

### Location

All uploaded template files are stored in the `templates_files` folder at the root of the project

### File Naming Convention

Uploaded files are renamed according to the following pattern:

`<template_name>-<timestamp>.<extension>`

- `<template_name>`: The `name` field of the template.
- `<timestamp>`: Current timestamp in milliseconds (to avoid collisions).
- `<extension>`: Extension type (.pdf, .docx, ...).

### Notes

- This ensures that files are unique even if multiple files with the same name are uploaded.
- Original file extensions are preserved to maintain compatibility with software (e.g., `.docx`, `.pdf`).
- Temporary files are written directly to the `templates` folder after upload.

## ⚙️ Prerequisites

- **Node.js** 24+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop)) (Windows / Mac / Linux)
- **Docker Compose** V2
- **MongoDB** (will be launched via Docker)
- **LibreOffice** (for PDF generation - see [LIBREOFFICE_SETUP.md](./LIBREOFFICE_SETUP.md))

## 💻 Installation

### Local Development (without Docker)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd report-service-api
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Configure environment variables**

   Create a `.env` file at the root (you can check expected keys in .env.example)

4. **Start MongoDB** (if not using Docker)

   ```bash
   mongod --dbpath /path/to/data
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Using Docker (Recommended)

See [Running the Containers](#-running-the-containers) section below.

## 🚀 Running the Containers

Go to the `docker/` folder.

### Development Mode

start containers:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

stop containers:

```bash
docker-compose -f docker-compose.dev.yml down
```

### Production Mode

```bash
docker-compose -f docker-compose.prod.yml up --build
```

stop containers:

```bash
docker-compose -f docker-compose.prod.yml down
```

To run containers in detached mode, simply add the -d flag at the end of the commands above.

### Check if Containers are Running

```bash
docker ps
```

## � API Documentation

The API is fully documented using **OpenAPI 3.1** (Swagger).

### Access Swagger UI

When running in **development mode**, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## 🧪 Testing

The project includes comprehensive integration tests using **Jest** and **Supertest**.

### Run Tests

```bash
# Run all tests
npm run test:watch

# Run tests in watch mode (development)
npm run test:watch
```

Each test file includes:

- ✅ Success scenarios
- ❌ Error handling (404, 400, 500)
- 📝 Data validation
- 🗂️ File system operations
- 🔄 Database state verification

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Use path aliases (`@services/*`, `@controllers/*`, etc.)
- Add JSDoc comments for public APIs
- Write meaningful commit messages

## �📝 Business Rules

## 1. Data Structure Schema Rules

The data structure describes the entire structure and all fields that the client expects to inject into the DOCX template.

See examples:

- [Text](./examples/text)
- [Object](./examples/object)
- [Collection](./examples/collection)
- [Image](./examples/image)

### 1.1 Allowed field types

Each field in the data structure must specify one of the supported types:

- text
- object
- collection
- image

### 1.2 Required vs optional fields

Each field must include:

```json
{ "required": true | false }
```

- required: true

The field must exist in the user's data, if the field is missing, the system will generate an error.

- required: false

The field may be omitted from the user's data.

```json
"example_1": {
  "type": "text",
  "required": true,
}

"example_2": {
  "type": "object",
  "required": true,
  "fields": {
    "country": { "type": "text", "required": true },
    "city": { "type": "text", "required": false }
  }
}
```

### 1.3 Text structure

A text only define is type and requirement level, for example (this type can cover 90 % of your usage):

data structure:

```json
{
  "example_text_1": { "type": "text", "required": true },
  "example_text_2": { "type": "text", "required": false }
}
```

data:

```json
{
  "example_text_1": "Jean Dupont",
  "not_expected_key": { "type": "text", "required": false }
}
```

the "example_text_1" key will be injected in the document, "not_expected_key" will be ignored and "example_text_2" will have two behaviours depeding on how you define your template:

- Without IF condition, a line will have been reserved for "example_text_2", so you will have an empty line between "example_text_1" and "This is the end of my super report"

Template:

```text
This is the start of my super report
{example_text_1}
{example_text_2}
This is the end of my super report
```

Output template:

```text
This is the start of my super report
Jean Dupont

This is the end of my super report
```

- With IF condition, a line will NOT have been reserved for "example_text_2", so you will have NOT have an empty line between "example_text_1" and "This is the end of my super report"

Template:

```text
This is the start of my super report
{example_text_1}
{IF example_text_2}
{example_text_2}
{END-IF}
This is the end of my super report
```

Output template:

```text
This is the start of my super report
Jean Dupont
This is the end of my super report
```

(NOTE: this apply to every structure type when you have some optional key/subkey: without IF condition wrapped over your key/subkey will result an empty space)

### 1.4 Object structure

An object must define its children and Each child must also declare a type and requirement level:

Structure:

```json
{
  "example_object_1": {
    "type": "object",
    "required": true,
    "fields": {
      "country": { "type": "text", "required": true },
      "city": { "type": "text", "required": true }
    }
  },
  "example_object_2": {
    "type": "object",
    "required": true,
    "fields": {
      "siret": { "type": "text", "required": true },
      "iban": { "type": "text", "required": false }
    }
  }
}
```

Data:

```json
{
  "example_object_1": {
    "fields": {
      "country": "France",
      "city": "paris"
    }
  },
  "example_object_2": {
    "fields": {
      "siret": "461781686161"
    }
  }
}
```

### 1.5 Collection structure

A collection must define its expected items:

(IMPORTANT: the "collection" type is useful when you need to generate between 0 and N instances of the same repeating structure. It is NOT intended for heterogeneous
content or mixed element types. Every item in a collection must conform to the same schema so the template engine can iterate safely and predictably. If you need differents
type the text or object strucutre is more appropriated)

Structure:

```json
{
  "example_collection_1": {
    "type": "collection",
    "required": true,
    "items": [{ "type": "text", "required": true }]
  },
  "example_collection_2": {
    "type": "collection",
    "required": false,
    "items": [
      {
        "type": "object",
        "required": false,
        "fields": {
          "security_lvl": { "type": "text", "required": true },
          "security_code": { "type": "text", "required": false }
        }
      }
    ]
  }
}
```

Data:

```json
{
  "example_collection_1": {
    "items": ["item-1", "item-2", "item-3"]
  },
  "example_collection_2": {
    "items": [
      {
        "fields": {
          "security_lvl": "low",
          "security_code": "100"
        }
      },
      {
        "fields": {
          "security_lvl": "warning"
        }
      }
    ]
  }
}
```

### 1.6 Image structure

Every image must have a unique id across the document. Uploading multiple files with the same id will result in a validation error.
Images are injected into templates using the `injectImg` function with the following parameters:

**Function Signature:**

```
{IMAGE injectImg(id, fieldPath, width, height, preset, caption)}
```

**Parameters:**

1. **id** (string, required): Unique identifier to match with uploaded files (runtime matching)
2. **fieldPath** (string, required): Path in data structure for template analysis (e.g., 'signature', 'example_3.fields.mon_image_1')
3. **width** (number, optional): Image width in pixels (use empty string "" to skip)
4. **height** (number, optional): Image height in pixels (use empty string "" to skip)
5. **preset** (string, optional): Size preset - "small" / "medium" / "large" (used when width/height are not specified)
6. **caption** (string, optional): Image caption text

**Data Structure:**

```json
{
  "signature": {
    "type": "image",
    "required": true
  },
  "profile_picture": {
    "type": "image",
    "required": false
  },
  "company_info": {
    "type": "object",
    "required": true,
    "fields": {
      "logo": {
        "type": "image",
        "required": true
      }
    }
  },
  "team_photos": {
    "type": "collection",
    "required": false,
    "items": [
      {
        "type": "image",
        "required": true
      }
    ]
  }
}
```

**Data:**

```json
{
  "signature": {
    "id": "sig1",
    "filename": "signature.png"
  },
  "profile_picture": {
    "id": "prof1",
    "filename": "profile.jpg"
  },
  "company_info": {
    "fields": {
      "logo": {
        "id": "logo1",
        "filename": "company_logo.png"
      }
    }
  },
  "team_photos": {
    "items": [
      {
        "id": "team1",
        "filename": "team_photo_1.jpg"
      },
      {
        "id": "team2",
        "filename": "team_photo_2.jpg"
      }
    ]
  }
}
```

**Template Examples:**

```text
1. Simple image with custom dimensions:
{IMAGE injectImg('sig1', 'signature', '200', '150', '', '')}

2. Image with preset size:
{IMAGE injectImg('sig1', 'signature', '', '', 'large', '')}

3. Image with preset and caption:
{IMAGE injectImg('sig1', 'signature', '', '', 'medium', 'Signature of John Doe')}

4. Optional image with IF condition:
{IF profile_picture}
{IMAGE injectImg('prof1', 'profile_picture', '150', '150', '', 'Profile Photo')}
{END-IF}

5. Image inside an object:
{IMAGE injectImg('logo1', 'company_info.fields.logo', '300', '100', '', 'Company Logo')}

6. Images in a collection (loop):
{FOR photo IN team_photos.items}
{IMAGE injectImg($photo.id, 'team_photos', '200', '200', '', '')}
{END-FOR photo}

7. Image with only width (medium preset will be applied):
{IMAGE injectImg('sig1', 'signature', '300', '', '', '')}

8. Image with only preset (no custom dimensions):
{IMAGE injectImg('prof1', 'profile_picture', '', '', 'small', '')}
```

**Important Notes:**

- The first parameter (`id`) is used at runtime to match with uploaded files
- The second parameter (`fieldPath`) is used for template analysis to verify fields exist in data structure
- If both width and height are empty, the preset is used (default: "medium")
- Supported image formats: JPG, PNG, GIF (automatically converted to PNG for PDF compatibility), SVG
- GIF images are automatically converted to PNG during PDF generation for better LibreOffice compatibility

## Data Payload (User Data) Rules

### 2.1 Unknown keys are ignored

If the data payload contains keys that are not defined in the data structure:

- They are silently ignored.
- They are neither copied nor injected into the final document.

This applies at any nesting depth:

- Unknown fields inside objects → ignored
- Unknown items inside arrays → ignored
- Unknown rows in tables → ignored

## 📊 XLSX Template Data Mapping

When generating XLSX files, the data you provide is automatically transformed to match the placeholders in your XLSX template. Here are some examples of how to structure your data and reference it in the template:

- **Single property**

  Data:

  ```json
  {
    "report_date": "December 23, 2025"
  }
  ```

  Template: `${report_date}`

- **Object**

  Data:

  ```json
  {
    "company": {
      "fields": {
        "name": "Acme Corporation",
        "address": "123 Business Street, New York, NY 10001"
      }
    }
  }
  ```

  Template: `${company.name}`

- **Simple array**

  Data:

  ```json
  {
    "customers": {
      "items": ["Jean Dupont", "Maria Garcia", "Liu Wei"]
    }
  }
  ```

  Template: `${customers}`

- **Array of objects (table)**

  Data:

  ```json
  {
    "subscriptions": {
      "items": [
        {
          "fields": {
            "description": "Premium Subscription - Annual Plan",
            "unit_price": "$1,200.00"
          }
        },
        {
          "fields": {
            "description": "Professional Services - Consulting Hours",
            "unit_price": "$150.00"
          }
        },
        {
          "fields": {
            "description": "Custom Integration Development",
            "unit_price": "$2,500.00"
          }
        }
      ]
    }
  }
  ```

  Template: `${table:subscriptions.description}` (renders a table column for each object's `description` field)

> **Note:**
>
> - The system automatically unwraps `{ fields: ... }` and `{ items: [...] }` wrappers, so you can use flat references in your XLSX template.
> - For tables, use `${table:collectionName.fieldName}` to render columns from an array of objects.
