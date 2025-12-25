import https from 'https';

const token = process.env.VERCEL_TOKEN;
const projectId = 'prj_JsU33EvR3eOlx73jVx4tIvTLMlxy';
const teamId = 'team_zsMRumjE7CE0dDkICR1SrFvq';

const postgresUrl = 'postgres://83d6bdb46126f946e46d3db6b39be22bfd315ff41b1c3a04c67d9a4db7f9101b:sk_zcun4UEPzlvIjP3WKFnHm@db.prisma.io:5432/postgres?sslmode=require';

const data = JSON.stringify({
  key: 'POSTGRES_URL',
  value: postgresUrl,
  target: ['production', 'preview', 'development'],
  type: 'encrypted'
});

const options = {
  hostname: 'api.vercel.com',
  path: `/v9/projects/${projectId}/env?teamId=${teamId}`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
