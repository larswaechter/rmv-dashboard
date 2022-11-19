import { Queue, Worker, WorkerOptions } from 'bullmq';

const redisConfiguration: WorkerOptions = {
  connection: {
    host: 'localhost',
    port: 6379
  }
};

async function sendEmail(job) {
  const { email, message } = job.data;
  console.log(`Message ${message} was sent to ${email}.`);
}

const worker = new Worker('emailSchedule', sendEmail, redisConfiguration);

worker.on('completed', (job) => {
  console.info(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});
