@echo off
setlocal

set TABLE_NAME=terraform-locks
set REGION=us-east-1

echo Checking if DynamoDB table exists...
aws dynamodb describe-table --table-name %TABLE_NAME% --region %REGION% >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo Table %TABLE_NAME% already exists.
    goto :eof
)

echo Creating DynamoDB table for Terraform state locking...
aws dynamodb create-table ^
    --table-name %TABLE_NAME% ^
    --attribute-definitions AttributeName=LockID,AttributeType=S ^
    --key-schema AttributeName=LockID,KeyType=HASH ^
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 ^
    --region %REGION%

if %ERRORLEVEL% NEQ 0 (
    echo Failed to create table %TABLE_NAME%
    exit /b %ERRORLEVEL%
)

echo Waiting for table to be created...
aws dynamodb wait table-exists --table-name %TABLE_NAME% --region %REGION%

if %ERRORLEVEL% NEQ 0 (
    echo Failed to wait for table creation
    exit /b %ERRORLEVEL%
)

echo ✅ DynamoDB table '%TABLE_NAME%' created successfully! 