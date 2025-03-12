// npm install axios
import axios from 'axios';

const api_key = 'CAP-F1E9FC03922E38944D9626D7A57AAAE0';
const site_key = '6LfwuyUTAAAAAOAmoS0fdqijC2PbbdH4kjq62Y1b';
const site_url = 'https://www.google.com';

export default async function capsolver() {
  const payload = {
    clientKey: api_key,
    task: {
      type: 'ReCaptchaV2TaskProxyLess',
      websiteKey: site_key,
      websiteURL: site_url,
    },
  };

  try {
    const res = await axios.post(
      'https://api.capsolver.com/createTask',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const task_id = res.data.taskId;
    if (!task_id) {
      console.log('Failed to create task:', res.data);
      return '';
    }
    console.log('Got taskId:', task_id);

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second

      const getResultPayload = { clientKey: api_key, taskId: task_id };
      const resp = await axios.post(
        'https://api.capsolver.com/getTaskResult',
        getResultPayload
      );
      const status = resp.data.status;

      if (status === 'ready') {
        return resp.data.solution.gRecaptchaResponse as string;
      }
      if (status === 'failed' || resp.data.errorId) {
        console.log('Solve failed! response:', resp.data);
        return '';
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}
