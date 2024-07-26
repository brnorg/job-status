const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const jobName = core.getInput('job_name');
    const waitTime = parseInt(core.getInput('wait_time'), 10);
    const pollInterval = parseInt(core.getInput('poll_interval'), 10) || 30;
    const { repo, run_id } = github.context;

    const token = core.getInput('github_token');
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };

    const getJobStatus = async () => {
      const response = await axios.get(`https://api.github.com/repos/${repo.owner}/${repo.repo}/actions/runs/${run_id}/jobs`, { headers });
      const jobs = response.data.jobs;
      const job = jobs.find(j => j.name === jobName);
      return job ? job : { status: 'unknown', conclusion: 'unknown' };
    };

    console.log(`Monitoring job: ${jobName}`);

    while (true) {
      const { status, conclusion } = await getJobStatus();
      console.log(`Current status of ${jobName}: ${status}, Conclusion: ${conclusion}`);

      if (status === 'completed') {
        if (conclusion === 'success') {
          console.log(`Job ${jobName} has completed successfully. Waiting ${waitTime} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          console.log(`Wait time of ${waitTime} seconds has passed.`);
          break;
        } else if (conclusion === 'failure' || conclusion === 'cancelled') {
          console.log(`Job ${jobName} has failed or was cancelled. Exiting with error.`);
          core.setFailed(`Job ${jobName} failed or was cancelled.`);
          return;
        }
      }

      console.log(`Job ${jobName} is not yet completed. Checking again in ${pollInterval} seconds...`);
      await new Promise(resolve => setTimeout(resolve, pollInterval * 1000)); // Polling interval
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
