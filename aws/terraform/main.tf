terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0f918f7e67a3323f0"
  instance_type = "t3.micro"

  availability_zone = "ap-south-1a"

  tags = {
    Name = "Homely-Hub-Server"
  }
}