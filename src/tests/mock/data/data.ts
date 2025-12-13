/********************************
 * TEXT CASES
 *******************************/
export const validText = {
    firstname: "Jean",
    lastname: "Dupont",
};

export const validTextWithOptional = {
    firstname: "Jean",
    lastname: "Dupont",
    nickname: "JD", // optional field
};

export const missingRequiredText = {
    lastname: "Dupont",
};

/********************************
 * OBJECT CASES
 *******************************/

export const validObject = {
    user: {
        fields: {
            firstname: "Jean",
            lastname: "Dupont",
            address: {
                fields: {
                    city: "Paris",
                },
            },
        },
    },
};

export const invalidObject = {
    user: {
        firstname: "Jean", // Should be inside 'fields'
    },
};

/********************************
 * COLLECTION CASES
 *******************************/

export const validCollection = {
    skills: {
        items: [
            { fields: { name: "TypeScript", level: "Advanced" } },
            { fields: { name: "Node.js", level: "Confirmed" } },
        ],
    },
};

export const invalidCollectionItem = {
    skills: {
        items: [
            { fields: { name: "JS" } }, // Missing required 'level' field
        ],
    },
};

/********************************
 * IMAGE CASES
 *******************************/

export const validImages = {
    avatar: {
        id: "img-1",
        filename: "avatar.jpg",
    },
    gallery: {
        items: [
            { id: "img-2", filename: "gallery-1.jpg" },
            { id: "img-3", filename: "gallery-2.jpg" },
        ],
    },
};

export const invalidImage = {
    avatar: "not-an-image",
};

export const missingRequiredImage = {
    gallery: {
        items: [{ id: "1", filename: "ok.jpg" }],
    },
};


/********************************
 * COMPLEX CASES
 *******************************/

export const validComplex = {
    report_title: "Annual Report",

    author: {
        fields: {
            firstname: "Jean",
            lastname: "Dupont",
            photo: {
                id: "img-author",
                filename: "author.jpg",
            },
        },
    },

    sections: {
        items: [
            {
                fields: {
                    title: "Introduction",
                    content: "This is the intro",
                },
            },
            {
                fields: {
                    title: "Results",
                    content: "Results content",
                    illustration: {
                        id: "img-section",
                        filename: "results.jpg",
                    },
                },
            },
        ],
    },
};

export const MOCKED_DATA = {
    text: { validText, validTextWithOptional, missingRequiredText },
    object: { validObject, invalidObject },
    collection: { validCollection, invalidCollectionItem },
    images: { validImages, invalidImage, missingRequiredImage },
    complex: { validComplex },
};
