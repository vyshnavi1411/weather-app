# DevOps Weather App Deployment

A React weather app deployed end-to-end using modern DevOps tools and cloud infrastructure.

## Architecture

```
Git Push → GitHub Webhook → Jenkins → Terraform → AWS EC2 → Ansible → K3s → App + Monitoring
```

## Tech Stack

| Tool | Purpose |
|---|---|
| Git / GitHub | Version control & source repository |
| Docker | Containerization |
| Jenkins | CI/CD automation |
| Terraform | Infrastructure as Code |
| Ansible | Configuration management |
| AWS EC2 | Cloud infrastructure |
| Prometheus + Grafana | Monitoring & dashboards |
| Node Exporter | System metrics |
| K3s | Lightweight Kubernetes |

---

## Prerequisites

Install via Homebrew:

```bash
brew install git terraform jenkins-lts ansible awscli ngrok/ngrok/ngrok
```

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Configure AWS CLI:

```bash
aws configure  # region: us-east-1, output: json
```

Start Jenkins and expose via ngrok:

```bash
brew services start jenkins-lts
ngrok http 8080
```

---

## Project Structure

```
weather-app/
└── weathernow/
    ├── Dockerfile
    ├── Jenkinsfile
    ├── package.json
    ├── src/
    ├── public/
    ├── terraform/
    │   └── main.tf
    ├── ansible/
    │   ├── install-monitoring.yml
    │   └── inventory.ini
    └── k8s/
        ├── deployment.yaml
        └── service.yaml
```

---

## How It Works

1. **Push** code to GitHub → webhook triggers Jenkins
2. **Jenkins** runs Terraform to provision EC2 + security groups
3. **Ansible** installs Docker, deploys the app, and sets up the monitoring stack
4. **K3s** manages the app as Kubernetes pods (2 replicas, NodePort 30080)
5. **Grafana** dashboards come up automatically (Dashboard ID: 1860)

---

## Key Ports

| Port | Service |
|---|---|
| 22 | SSH |
| 80 | Weather App |
| 3000 | Grafana |
| 8080 | Jenkins |
| 9090 | Prometheus |
| 9100 | Node Exporter |
| 30080 | K3s NodePort |

---

## Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Kubernetes

**deployment.yaml** — 2 replicas of the weather app  
**service.yaml** — NodePort service on port 30080

Deploy:

```bash
sudo kubectl apply -f k8s/
sudo kubectl get pods
sudo kubectl get svc
```

---

## Jenkins Pipeline Stages

1. Terraform Init → Validate → Plan → Apply
2. Generate Ansible Inventory
3. Wait for EC2
4. Install Monitoring Stack
5. Destroy Infrastructure *(manual approval)*

---

## GitHub Webhook

Go to **Repository → Settings → Webhooks** and add:

- **Payload URL:** `https://YOUR-NGROK-URL/github-webhook/`
- **Content Type:** `application/json`
- **Events:** Push only

---

## Verification

| Service | URL |
|---|---|
| Weather App | `http://PUBLIC-IP` or `http://PUBLIC-IP:30080` |
| Prometheus | `http://PUBLIC-IP:9090/targets` |
| Grafana | `http://PUBLIC-IP:3000` (admin / admin) |
| Node Exporter | `http://PUBLIC-IP:9100/metrics` |

---

## Future Enhancements

- AWS EKS deployment
- Helm Charts
- Auto Scaling
- SSL / HTTPS
- Load Balancer
- Alertmanager notifications
- ArgoCD integration

---

## Author

**Vyshnavi Reddy** — created for educational purposes.