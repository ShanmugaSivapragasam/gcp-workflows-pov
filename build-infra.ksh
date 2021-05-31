gcloud container clusters create workflows-cluster --num-nodes 1 --zone us-central1-a ;
gcloud container clusters get-credentials workflows-cluster --zone us-central1-a ;
cd ~/git/gcp-workflows-pov/validator/;kubectl apply -f deployment.yaml;
cd ../payment; kubectl apply -f deployment.yaml;
cd ../marketing; kubectl apply -f deployment.yaml;
cd ../loyalty; kubectl apply -f deployment.yaml;
cd ../discounts; kubectl apply -f deployment.yaml;
cd ~/git/gcp-workflows-pov/validator/;kubectl apply -f *-service.yaml;
cd ../payment; kubectl apply -f *-service.yaml;
cd ../marketing; kubectl apply -f *-service.yaml;
cd ../loyalty; kubectl apply -f *-service.yaml;
cd ../discounts; kubectl apply -f *-service.yaml;
cd .. ; kubectl apply -f ingress.yaml;

gcloud container clusters create orchestrator-cluster --num-nodes 1 --zone us-central1-a ;
gcloud container clusters get-credentials orchestrator-cluster --zone us-central1-a; 
cd ~/git/gcp-workflows-pov/orchestrator;kubectl apply -f deployment.yaml;kubectl apply -f *-service.yaml;