var CronJob = require('cron').CronJob;

const fetchGithub = require('./tasks/fetch-github');

var job = new CronJob(
  '* * * * *',
  function () {
    console.log('fetching github jobs');
    fetchGithub();
  },
  null,
  true,
  'America/Los_Angeles'
);
job.start();
