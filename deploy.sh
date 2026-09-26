#!/bin/bash

echo "🚀 Deploying Homely Hub..."

# Apply Deployment
kubectl apply -f deployment.yml

# Apply Service
kubectl apply -f service.yml

echo "⏳ Waiting for deployment..."

kubectl rollout status deployment/my-project

echo "✅ Deployment successful!"

echo "📦 Pods:"
kubectl get pods

echo ""
echo "🌐 Service:"
kubectl get service my-project-service

echo ""
echo "🎉 Homely Hub is deployed!"