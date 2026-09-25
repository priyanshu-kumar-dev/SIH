# output.tf

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.homely_hub.id
}

output "instance_public_ip" {
  description = "Public IP address of the Homely Hub EC2 instance"
  value       = aws_instance.homely_hub.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the Homely Hub EC2 instance"
  value       = aws_instance.homely_hub.public_dns
}

output "homely_hub_url" {
  description = "Homely Hub application URL"
  value       = "http://${aws_instance.homely_hub.public_ip}:3000"
}

output "http_url" {
  description = "HTTP URL"
  value       = "http://${aws_instance.homely_hub.public_ip}"
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i <your-key.pem> ec2-user@${aws_instance.homely_hub.public_ip}"
}

output "docker_image" {
  description = "Docker image running on Homely Hub"
  value       = var.docker_image
}