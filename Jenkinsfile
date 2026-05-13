pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {

        stage('Docker Build & Push') {
            steps {
                sh '''
                docker buildx create --use || true

                docker buildx build \
                --platform linux/amd64 \
                -t vyshnavi1411/weather-app:latest \
                --push .
                '''
            }
        }

        stage('Terraform Init') {
            steps {
                sh 'cd terraform && terraform init'
            }
        }

        stage('Terraform Validate') {
            steps {
                sh 'cd terraform && terraform validate'
            }
        }

        stage('Terraform Plan') {
            steps {
                sh 'cd terraform && terraform plan'
            }
        }

        stage('Terraform Apply') {
            steps {
                sh 'cd terraform && terraform apply -auto-approve'
            }
        }

        stage('Generate Ansible Inventory') {
            steps {
                sh '''
                PUBLIC_IP=$(cd terraform && terraform output -raw public_ip)

                echo "[web]" > ansible/inventory.ini

                echo "$PUBLIC_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa" >> ansible/inventory.ini

                cat ansible/inventory.ini
                '''
            }
        }

        stage('Wait For EC2') {
            steps {
                sh 'sleep 60'
            }
        }

        stage('Install Monitoring & K3s Stack') {
            steps {
                sh '''
                export ANSIBLE_HOST_KEY_CHECKING=False

                cd ansible

                ansible-playbook -i inventory.ini install-monitoring.yml
                '''
            }
        }

        stage('Verify Kubernetes') {
            steps {
                sh '''
                export ANSIBLE_HOST_KEY_CHECKING=False

                PUBLIC_IP=$(cd terraform && terraform output -raw public_ip)

                ssh -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP "sudo kubectl get nodes"

                ssh -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP "sudo kubectl get pods"

                ssh -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP "sudo kubectl get svc"
                '''
            }
        }

        stage('Destroy Infrastructure') {
            steps {
                input 'Do you want to destroy infrastructure?'

                sh 'cd terraform && terraform destroy -auto-approve'
            }
        }
    }
}

