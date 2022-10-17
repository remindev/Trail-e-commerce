import * as DB from './schema.js';

import { randomId } from './auth.js';

/**
 * @param {Object} data
 * @param {String} data.title
 * @param {Number} data.price
 * @param {String} data.description
 * @param {Number} data.offer
 * @param {Number} data.stock
 * @param {String} data.category
 * @param {String} data.PID
 * @param {File} data.files
 * @param {Object} requiredIn
 * @param {Boolean} requiredIn.title
 * @param {Boolean} requiredIn.price
 * @param {Boolean} requiredIn.description
 * @param {Boolean} requiredIn.offer
 * @param {Boolean} requiredIn.stock
 * @param {Boolean} requiredIn.category
 * @param {Boolean} requiredIn.PID
 * @param {Boolean} requiredIn.files
 * @param {string} typeOfValidation
 */
export function validatior(data, requiredIn, typeOfValidation) {


    let title = data.title ? data.title.trim() : [];

    let price = data.price ? data.price : [];

    let description = data.description ? data.description.trim() : [];

    let offer = data.offer ? data.offer : [];

    let stock = data.stock ? data.stock : [];

    let category = data.category ? data.category : [];

    let files = data.files ? data.files : [];

    let PID = data.PID ? data.PID : [];


    let titleRequired = requiredIn.title ? true : false;

    let priceRequired = requiredIn.price ? true : false;

    let descriptionRequired = requiredIn.description ? true : false;

    let offerRequired = requiredIn.offer ? true : false;

    let stockRequired = requiredIn.stock ? true : false;

    let categoryRequired = requiredIn.category ? true : false;

    let filesRequired = requiredIn.files ? true : false;

    let PIDRequired = requiredIn.PID ? true : false;


    let PID_LENGTH = 20;


    let output = {
        title: null,
        price: null,
        description: null,
        offer: null,
        stock: null,
        category: null,
        files: null,
        PID: null
    };


    return new Promise(async (resolve, reject) => {

        // title validation
        if (title.length != 0 || titleRequired) {

            if (title.length == 0) {

                reject("Title required"); return 0;

            } else if (title.length < 10) {

                reject("Title must be 10 characters"); return 0;

            } else {

                output.title = title;

            };

        };

        // price validation
        if (price.length != 0 || priceRequired) {

            if (price.length == 0) {

                reject("Price required"); return 0;

            } else if (price < 0) {

                reject("Price is not valid"); return 0;

            } else {

                output.price = price;

            };

        };

        // description validation
        if (description.length != 0 || descriptionRequired) {

            if (description.length == 0) {

                reject("Description required"); return 0;

            } else if (description.length < 20) {

                reject("Description must contain atleast 20 characters"); return 0;

            } else {

                output.description = description;

            };

        };

        // offer validation
        if (offer.length != 0 || offerRequired) {

            if (offer.length == 0) {

                reject("Offer required"); return 0;

            } else if (offer < 0) {

                reject("Enter a valid offer"); return 0;

            } else {

                output.offer = offer;

            };

        };

        // stock validation
        if (stock.length != 0 || stockRequired) {

            if (stock.length == 0) {

                reject("Offer required"); return 0;

            } else if (stock < 0) {

                reject("Enter a valid offer"); return 0;

            } else {

                output.stock = stock;

            };

        };

        // catorgary validation
        if (category.length != 0 || categoryRequired) {

            if (category.length == 0) {

                reject("Category required"); return 0;

            } else if (category.length < 2) {

                reject("Enter a valid Category"); return 0;

            } else {

                output.category = category;

            };

        };

        // files validation 
        if (Object.keys(files).length != 0 || filesRequired) {

            if (Object.keys(files).length == 0) {

                reject("File Required"); return 0;

            } else {

                output.files = files;

            };

        };

        // UID Creation
        if (PID.length != 0 || PIDRequired) {

            if (typeOfValidation == 'addproduct') {

                do {

                    PID = randomId(PID_LENGTH);

                } while ((await DB.products.find({ PID: PID })).length != 0);

                output.PID = PID;

            } else {

                if (PID.length == 0) {

                    reject("PID Required"); return 0;

                } else if (PID.length != PID_LENGTH) {

                    reject("Invalid PID"); return 0;

                } else {

                    output.PID = PID;

                } ;

            };

        };

        resolve(output);

    });

};


/**
 * 
 * @param {Request} request 
 * @returns promise contains user data
 */
export async function createProduct(request) {

    let body = JSON.parse(request.body.category);

    let tilte = body.name;

    let price = body.price;

    let description = body.description;

    let offer = body.offer;

    let stock = body.stock;

    let category = body.category;

    let files = request.files;


    return new Promise(async (resolve,reject)=>{

        try {

            let output = await validatior(
                {
                    title:tilte,
                    price:price,
                    description:description,
                    offer:offer,
                    stock:stock,
                    category:category,
                    files:files
                },
                {
                    title:true,
                    price:true,
                    description:true,
                    files:true,
                    PID:true
                },
                'addproduct'
            );

            console.log(output);
        
        } catch (error) {
            
            reject(error);
    
        };
    

    });
   
}