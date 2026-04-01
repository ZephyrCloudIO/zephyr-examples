#!/bin/bash

# Function to kill processes running on specified ports
kill_mobile_development_servers() {
    echo "🧹 Kill process initiated..."

    # Check if ports are passed as arguments
    if [ "$#" -eq 0 ]; then
        echo "Error: No ports specified. Please provide ports as arguments."
        exit 1
    fi

    PORTS=("$@")

    # Loop through each port
    for PORT in "${PORTS[@]}"; do
        # Find the processes running on the specified port
        PIDS=$(lsof -t -i:$PORT)
        if [ -n "$PIDS" ]; then
            echo "Stopping processes running on port $PORT with PIDs $PIDS..."
            # Kill each process individually
            for PID in $PIDS; do
                kill -9 "$PID"
                echo "Process with PID $PID on port $PORT stopped successfully."
            done
        else
            echo "No process found running on port $PORT."
        fi
    done

    echo "🧼 Kill process completed."
}
