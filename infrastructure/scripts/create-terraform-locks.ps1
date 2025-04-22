# Create DynamoDB table for Terraform state locking
$tableName = "terraform-locks"
$region = "us-east-1"

# Check if table already exists
$existingTable = aws dynamodb describe-table --table-name $tableName --region $region 2>$null

if ($null -eq $existingTable) {
    Write-Host "Creating DynamoDB table for Terraform state locking..."
    
    # Create the table
    aws dynamodb create-table `
        --table-name $tableName `
        --attribute-definitions AttributeName=LockID,AttributeType=S `
        --key-schema AttributeName=LockID,KeyType=HASH `
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
        --region $region

    # Wait for table to be created
    Write-Host "Waiting for table to be created..."
    aws dynamodb wait table-exists --table-name $tableName --region $region

    Write-Host "✅ DynamoDB table '$tableName' created successfully!"
} else {
    Write-Host "Table '$tableName' already exists."
} 