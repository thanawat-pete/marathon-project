const http = require('http');

const data = JSON.stringify({
  name: 'ณัฐสุดา รงทอง',
  category: '21k',
  email: '664259006@webmail.npru.ac.th',
  phone: '0982422972'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', error => {
  console.error('Connection Error:', error.message);
});

req.write(data);
req.end();
