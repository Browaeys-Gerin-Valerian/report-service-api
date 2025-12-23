/********************************
 * TEXT CASES
 *******************************/

export const text = {
    firstname: { type: "text", required: true },
    lastname: { type: "text", required: true },
    nickname: { type: "text", required: false },
};

/********************************
 * OBJECT CASES
 *******************************/

export const object = {
    user: {
        type: "object",
        required: true,
        fields: {
            firstname: { type: "text", required: true },
            lastname: { type: "text", required: true },
            address: {
                type: "object",
                required: false,
                fields: {
                    city: { type: "text", required: true },
                    zip: { type: "text", required: false },
                },
            },
        },
    },
};

/********************************
 * COLLECTION CASES
 *******************************/

export const collection = {
    skills: {
        type: "collection",
        required: true,
        items: [
            {
                type: "object",
                required: true,
                fields: {
                    name: { type: "text", required: true },
                    level: { type: "text", required: true },
                },
            },
        ],
    },
};

/********************************
 * IMAGE CASES
 *******************************/

export const images = {
    avatar: {
        type: "image",
        required: true,
    },
    gallery: {
        type: "collection",
        required: false,
        items: [{ type: "image", required: true }],
    },
};

/********************************
 * COMPLEX CASE
 *******************************/

export const complex = {
    report_title: { type: "text", required: true },

    author: {
        type: "object",
        required: true,
        fields: {
            firstname: { type: "text", required: true },
            lastname: { type: "text", required: true },
            photo: { type: "image", required: false },
        },
    },

    sections: {
        type: "collection",
        required: true,
        items: [
            {
                type: "object",
                required: true,
                fields: {
                    title: { type: "text", required: true },
                    content: { type: "text", required: true },
                    illustration: { type: "image", required: false },
                },
            },
        ],
    },
};


export const MOCKED_DATA_STRUCTURE = {
    text,
    object,
    collection,
    images,
    complex,
};
