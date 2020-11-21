@ECHO OFF
cd client
pm2 start node_modules/react-scripts/scripts/start.js --name "Jueera Client"