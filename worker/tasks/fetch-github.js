var fetch = require('node-fetch');
var redis = require('redis');
var client = redis.createClient();

const { promisify } = require('util');

const setAsync = promisify(client.set).bind(client);

const baseUrl = 'https://jobs.github.com/positions.json';

async function fetchGithub() {
  let resultCount = 1;
  let onPage = 0;
  const allJobs = [];

  // fetch all pages
  while (resultCount > 0) {
    const res = await fetch(`${baseUrl}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    resultCount = jobs.length;
    onPage++;
  }

  // filter algorithm
  const jrJobs = allJobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();
    const nonJuniorVerbiages = ['senior', 'manager', 'sr.', 'architect'];
    let isJunior = true;

    // algo logic
    if (nonJuniorVerbiages.some((str) => jobTitle.includes(str))) {
      isJunior = false;
      return isJunior;
    }
    return isJunior;
  });

  // set in redis
  const success = await setAsync('github', JSON.stringify(jrJobs));
}

module.exports = fetchGithub;
