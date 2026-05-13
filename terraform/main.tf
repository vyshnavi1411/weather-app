terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.100.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
resource "aws_key_pair" "deployer" {
  key_name   = "weather-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_security_group" "weather_sg" {
  name = "weather-security-group"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Grafana"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Node Exporter"
    from_port   = 9100
    to_port     = 9100
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
  description = "Kubernetes NodePort"
  from_port   = 30080
  to_port     = 30080
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "weather_server" {
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t3.small"

  key_name = aws_key_pair.deployer.key_name

  security_groups = [aws_security_group.weather_sg.name]

  user_data = <<-EOF
#!/bin/bash

apt update -y
apt install -y python3 python3-pip

EOF

  tags = {
    Name = "WeatherAppServer"
  }
}

output "public_ip" {
  value = aws_instance.weather_server.public_ip
}