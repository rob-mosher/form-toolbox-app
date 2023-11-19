# form-toolbox

### Prerequisites

- `docker`

### Running Locally

To run a development build, which includes hot-reloading:

1. `docker compose build`
2. `docker compose up -d`

When no longer needed, run:

1. `docker compose down`

### Notes

- `AWS_SQS_REQUEUE_DELAY` is in seconds, not milliseconds
- `docker-compose.yaml` will eventually be renamed to `docker-compose-dev.yaml`. See `docker-compose.yaml` file for more details.
