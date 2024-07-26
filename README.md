# Job Status Action

## Description

The **Job Status Action** is a GitHub Action that allows you to monitor the status of a specific job in a GitHub Actions workflow. It checks the job's status at defined intervals and waits for a specified period after the job completes before finishing. If the monitored job fails or is canceled, the action will be interrupted and marked as failed.

## How It Works

1. **Monitors the status**: Checks the status of the specified job at defined intervals.
2. **Waits after completion**: After the monitored job completes, it waits for a defined period before ending.
3. **Interrupts on failure**: If the monitored job fails or is canceled, the action is stopped and marked as failed.

## Inputs

- `job_name` (required): The name of the job to monitor.
- `wait_time` (required): The time to wait after the job completes, in seconds.
- `poll_interval` (optional): The interval to check the job status, in seconds. Default is 30 seconds.

## Example Usage

Here’s an example of how to use the **Job Status Action** in a GitHub Actions workflow:

```yaml
name: Example Workflow with Job Status

on: [push]

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run some tasks
        run: |
          echo "This is job1 running."
          sleep 20

  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Execute tasks in job2
        run: |
          echo "This is job2 running."
          sleep 10
          # Uncomment below to simulate failure
          # exit 1

  monitor:
    runs-on: ubuntu-latest
    needs: job2
    steps:
      - name: Monitor job2
        uses: your-username/job-status@v1
        with:
          job_name: job2
          wait_time: 30
          poll_interval: 20
          github_token: ${{ secrets.GITHUB_TOKEN }}

```


## Detailed Inputs
#### job_name
The name of the job you want to monitor. Ensure that the name matches exactly with the job name in the workflow.

#### wait_time
The time (in seconds) that the action will wait after the monitored job is completed. For example, if you set wait_time to 30, the action will wait 30 seconds after the job completes before finishing.

#### poll_interval
The interval (in seconds) between each status check of the job. The default value is 30 seconds. Adjust this value as needed for more or less frequent checks.

#### github_token
The GitHub authentication token. Typically, you can use the default token ${{ secrets.GITHUB_TOKEN }} provided by GitHub Actions.

## Contributing
If you would like to contribute to the Job Status Action, feel free to open issues or pull requests in the repository. Your contributions are greatly appreciated!

License
This project is licensed under the MIT License.