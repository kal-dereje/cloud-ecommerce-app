resource "aws_s3_bucket" "product_images" {
  bucket = "${local.prefix}-product-images-${random_string.suffix.result}"
  
  tags = {
    Environment = var.environment
  }
}

# Enable public access to the bucket
resource "aws_s3_bucket_ownership_controls" "product_images" {
  bucket = aws_s3_bucket.product_images.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "product_images" {
  bucket = aws_s3_bucket.product_images.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "product_images" {
  depends_on = [
    aws_s3_bucket_ownership_controls.product_images,
    aws_s3_bucket_public_access_block.product_images,
  ]

  bucket = aws_s3_bucket.product_images.id
  acl    = "public-read"
}

resource "aws_s3_bucket_cors_configuration" "product_images_cors" {
  bucket = aws_s3_bucket.product_images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "product_images" {
  depends_on = [
    aws_s3_bucket_public_access_block.product_images,
    aws_s3_bucket_acl.product_images
  ]

  bucket = aws_s3_bucket.product_images.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = [
          "s3:GetObject",
          "s3:GetObjectAcl"
        ]
        Resource  = "${aws_s3_bucket.product_images.arn}/*"
      }
    ]
  })
}

output "product_images_bucket" {
  value = aws_s3_bucket.product_images.id
}

output "product_images_bucket_arn" {
  value = aws_s3_bucket.product_images.arn
} 