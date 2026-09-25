# variable.tf

variable "project_name" {
  description = "Name of the Homely Hub project"
  type        = string
  default     = "Homely-Hub"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region where Homely Hub will be deployed"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Amazon Linux 2023 AMI ID"
  type        = string
  default     = "ami-0f918f7e67a3323f0"
}

variable "key_name" {
  description = "AWS EC2 key pair name"
  type        = string
  default     = "homely-hub-key"
}

variable "ssh_port" {
  description = "SSH port"
  type        = number
  default     = 22
}

variable "http_port" {
  description = "HTTP port"
  type        = number
  default     = 80
}

variable "https_port" {
  description = "HTTPS port"
  type        = number
  default     = 443
}

variable "app_port" {
  description = "Homely Hub application port"
  type        = number
  default     = 3000
}

variable "docker_image" {
  description = "Docker image used for Homely Hub"
  type        = string
  default     = "prxo/my-project:04"
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to access SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_http_cidr" {
  description = "CIDR allowed to access HTTP"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_https_cidr" {
  description = "CIDR allowed to access HTTPS"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "volume_size" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 20
}

variable "volume_type" {
  description = "Root EBS volume type"
  type        = string
  default     = "gp3"
}

variable "tags" {
  description = "Common AWS resource tags"
  type        = map(string)

  default = {
    Project     = "Homely Hub"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}