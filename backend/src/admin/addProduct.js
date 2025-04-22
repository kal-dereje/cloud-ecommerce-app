const { v4: uuidv4 } = require("uuid");
const { docClient } = require("../shared/dynamodbClient");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Busboy = require('busboy');

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET_NAME = process.env.PRODUCT_IMAGES_BUCKET;

function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = {};

    const busboy = Busboy({
      headers: {
        'content-type': event.headers['content-type'] || event.headers['Content-Type']
      }
    });

    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on('file', (fieldname, file, { filename, encoding, mimeType }) => {
      const chunks = [];

      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        files[fieldname] = {
          filename,
          content: Buffer.concat(chunks),
          encoding,
          mimetype: mimeType
        };
      });
    });

    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body;

    busboy.write(body);
    busboy.end();
  });
}

exports.handler = async (event) => {
  try {
    let productData;
    let imageUrls = [];

    // Check content type
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle multipart form data
      const { fields, files } = await parseMultipartForm(event);
      
      // Upload images to S3 if present
      if (Object.keys(files).length > 0) {
        for (const file of Object.values(files)) {
          // Generate a unique key for the image
          const key = `products/${uuidv4()}-${file.filename.replace(/[^a-zA-Z0-9.]/g, '-')}`;

          // Upload the file to S3 with public read access
          await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.content,
            ContentType: file.mimetype || 'application/octet-stream',
            ContentDisposition: `inline; filename="${file.filename}"`,
            ACL: 'public-read',
            CacheControl: 'max-age=31536000'
          }));

          // Generate the public URL with proper encoding
          const encodedKey = encodeURIComponent(key).replace(/%2F/g, '/');
          const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${encodedKey}`;
          imageUrls.push(publicUrl);
        }
      }

      productData = {
        ...fields,
        imageUrls
      };
    } else {
      // Handle JSON data
      productData = JSON.parse(event.body);
    }

    // Create product object
    const product = {
      id: uuidv4(),
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice) : null,
      stock: parseInt(productData.stock, 10),
      category: productData.category,
      brand: productData.brand || 'Unknown',
      tags: Array.isArray(productData.tags) ? productData.tags : JSON.parse(productData.tags || '[]'),
      imageUrls: productData.imageUrls || imageUrls,
      timesOrdered: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: product
      })
    );

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Product created successfully',
        product
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error creating product',
        error: error.message
      })
    };
  }
};
