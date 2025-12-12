# 📘 Report Service API

API Node.js + Express + TypeScript + MongoDB avec Docker.

# 📁 Structure du projet

my-app/
├─ src/ # Code TypeScript
├─ docker/ # Fichiers Docker
│ ├─ Dockerfile.dev
│ ├─ Dockerfile.prod
│ ├─ docker-compose.dev.yml
│ └─ docker-compose.prod.yml
├─ package.json
├─ tsconfig.json
├─ .env
└─ README.md

# ⚙️ Prérequis

- Node.js 24+
- npm ou yarn
- Docker Desktop (Windows / Mac / Linux)
- Docker Compose V2
- MongoDB (sera lancé via Docker)

# 📄 Templates File Storage

## Location

All uploaded template files are stored in the `templates_files` folder at the root of the project

## File Naming Convention

Uploaded files are renamed according to the following pattern:

`<template_name>-<timestamp>.<extension>`

- `<template_name>`: The `name` field of the template.
- `<timestamp>`: Current timestamp in milliseconds (to avoid collisions).
- `<extension>`: Extension type (.pdf, .docx, ...).

## Notes

- This ensures that files are unique even if multiple files with the same name are uploaded.
- Original file extensions are preserved to maintain compatibility with software (e.g., `.docx`, `.pdf`).
- Temporary files are written directly to the `templates` folder after upload.

# 🚀 Running the Containers

Go to the `docker/` folder.

## Development Mode

start containers:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

stop containers:

```bash
docker-compose -f docker-compose.dev.yml down
```

## Production Mode

```bash
docker-compose -f docker-compose.prod.yml up --build
```

stop containers:

```bash
docker-compose -f docker-compose.prod.yml down
```

To run containers in detached mode, simply add the -d flag at the end of the commands above.

## Check if Containers are Running

```bash
docker ps
```

# 📝 Business Rules

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

The field may be omitted from the user's data, If omitted, the system will create a minimal empty parent container to avoid error from docx-templates.

```json
"example_1": {
  "type": "object",
  "required": true,
  "fields": {
    "country": { "type": "text", "required": true },
    "city": { "type": "text", "required": true }
  }
}

"example_2": {
  "type": "object",
  "required": true,
  "fields": {
    "country": { "type": "text", "required": true },
    "city": { "type": "text", "required": false }
  }
}

"example_3": {
  "type": "object",
  "required": false,
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

(NOTE: this apply to every structure type when you have some optional subkey: without IF condition wrapped over your subkey will result an empty space)

### 1.4 Object structure

An object must define its children and Each child must also declare a type and requirement level:

```json
{
  "example_object_1": {
    "type": "object",
    "required": true,
    "fields": {
      "country": { "type": "text", "required": true },
      "city": { "type": "text", "required": false }
    }
  },
  "example_object_2": {
    "type": "object",
    "required": false,
    "fields": {
      "country": { "type": "text", "required": false },
      "city": { "type": "text", "required": false }
    }
  }
}
```

### 1.5 Collection structure

A collection must define its expected items:

(IMPORTANT: the "collection" type is useful when you need to generate between 0 and N instances of the same repeating structure. It is NOT intended for heterogeneous
content or mixed element types. Every item in a list must conform to the same schema so the template engine can iterate safely and predictably. If you need differents
type the text or object strucutre is more appropriated)

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
          "security_lvl": { "type": "text", "required": false },
          "security_code": { "type": "text", "required": false }
        }
      }
    ]
  },
  "example_collection_3": {
    "type": "collection",
    "required": false,
    "items": [
      {
        "type": "object",
        "required": true,
        "fields": {
          "security_lvl": { "type": "text", "required": false },
          "security_code": { "type": "text", "required": true }
        }
      }
    ]
  }
}
```

### 1.6 Image structure

Every image must have a unique id across the document. Uploading multiple files with the same id will result in a validation error.
Images can have optional width and height defined directly in the template call, if either is missing, a preset (small / medium / large) can be applied.

Structure:

```json
{
  "signature": {
    "type": "image",
    "required": true
  },
  "profile_picture": {
    "type": "image",
    "required": false
  }
}
```

Data:

```json
{
  "signature": {
    "id": "sig1",
    "filename": "signature.png"
  },
  "profile_picture": {
    "id": "prof1",
    "filename": "profile.jpg"
  }
}
```

```text
{IMAGE injectImg('sig1', 200, 150)}
{IMAGE injectImg('sig1', undefined, undefined, "large")}
{IMAGE injectImg('sig1', undefined, undefined, "medium", "Signature of John Doe")}
```

## Data Payload (User Data) Rules

### 2.1 Unknown keys are ignored

If the data payload contains keys that are not defined in the data structure:

- They are silently ignored.
- They are neither copied nor injected into the final document.

This applies at any nesting depth:

- Unknown fields inside objects → ignored
- Unknown items inside arrays → ignored
- Unknown rows in tables → ignored
