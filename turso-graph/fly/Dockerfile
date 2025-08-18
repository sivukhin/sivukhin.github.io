FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy your static files
COPY . .

# Expose HTTP port
EXPOSE 8000

# Run server from /dist
CMD ["python", "/app/server.py"]
