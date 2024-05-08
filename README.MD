How to run the project.

docker-compose up --build -d

INFOS:
https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/

kubectl cluster-info

minikube dashboard

eval $(minikube docker-env)

eval $(minikube docker-env -u) // para desfazer

kubectl apply -f ./k8s

kubectl delete -f ./k8s

cd folder
docker build -t hramos13/ubi-final-project-sqlserver .
docker push hramos13/ubi-final-project-sqlserver

kubectl get pods -l app=back2
kubectl logs back2-7584644fc5-xkdrr

minikube service list
minikube service back2-service

minikube ip

kubectl get services
