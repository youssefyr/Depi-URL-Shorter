#!/bin/bash

SESSION="url-shortener"

# Kill existing session if it exists
tmux kill-session -t $SESSION 2>/dev/null || true

tmux new-session -d -s $SESSION -n "port-forwards"

tmux split-window -h -t $SESSION
tmux split-window -v -t $SESSION:0.0
tmux split-window -v -t $SESSION:0.2

GRAFANA_PORT=$(kubectl get svc grafana -n url-shortener -o jsonpath='{.spec.ports[0].port}' 2>/dev/null || echo "3000")

# Start port-forwards in each pane
tmux send-keys -t $SESSION:0.0 "kubectl port-forward -n url-shortener svc/frontend 3001:80" C-m
tmux send-keys -t $SESSION:0.1 "kubectl port-forward -n url-shortener svc/backend 3000:3000" C-m
tmux send-keys -t $SESSION:0.2 "kubectl port-forward -n url-shortener svc/grafana 3002:${GRAFANA_PORT}" C-m
tmux send-keys -t $SESSION:0.3 "kubectl port-forward -n url-shortener svc/prometheus 9090:9090" C-m

tmux attach-session -t $SESSION