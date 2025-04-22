##########################################
# Cognito User Pool Configuration
##########################################

resource "aws_cognito_user_pool" "main" {
  name = "${local.prefix}-user-pool"

  auto_verified_attributes = ["email"]

  lambda_config {
    post_confirmation = aws_lambda_function.postConfirmationTrigger.arn
  }

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_lambda_permission" "allow_cognito_invoke" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.postConfirmationTrigger.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "${local.prefix}-app-client"
  user_pool_id = aws_cognito_user_pool.main.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  generate_secret = false
  
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation      = true
  read_attributes             = ["email", "email_verified", "preferred_username"]
  write_attributes            = ["email", "preferred_username"]
  
  callback_urls               = ["https://your-app-domain.com/callback"]
  logout_urls                 = ["https://your-app-domain.com/logout"]
  allowed_oauth_flows         = ["implicit"]
  allowed_oauth_scopes        = ["email", "openid", "profile"]
  supported_identity_providers = ["COGNITO"]

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  id_token_validity = 60  # 60 minutes
  access_token_validity = 60  # 60 minutes
  refresh_token_validity = 30  # 30 days
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain          = "${local.prefix}-auth-${random_string.suffix.result}"
  user_pool_id    = aws_cognito_user_pool.main.id
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_cognito_user_group" "admin_group" {
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.main.id
  description  = "Administrators group"
}

##########################################
# Outputs
##########################################

output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.main.arn
}
