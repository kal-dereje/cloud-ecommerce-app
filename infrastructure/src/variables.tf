##########################################
# variables.tf
# Input variables used in main.tf and other modules
##########################################

variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS named profile (used only for local development)" 
  type        = string
  default     = ""  # Empty string means use default credentials
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
  default     = "prod" #! change this to your prod later
}

# variable "products_table_name" {
#   description = "Name of the DynamoDB table for products"
#   type        = string
#   default = "Products"
# }

variable "github_repo_url" {
  description = "The URL of the GitHub repository"
  type        = string
}

variable "github_repo_owner" {
  description = "The owner of the GitHub repository"
  type        = string
}

variable "github_repo_name" {
  description = "The name of the GitHub repository"
  type        = string
}

variable "github_token" {
  description = "GitHub OAuth token for CodePipeline"
  type        = string
  sensitive   = true
}
