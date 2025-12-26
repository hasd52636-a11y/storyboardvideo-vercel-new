// This file ensures POSTGRES_URL is available by copying from wboke_POSTGRES_URL if needed
if (!process.env.POSTGRES_URL) {
  if (process.env.wboke_POSTGRES_URL) {
    process.env.POSTGRES_URL = process.env.wboke_POSTGRES_URL;
  } else if (process.env.wboke_DATABASE_URL) {
    process.env.POSTGRES_URL = process.env.wboke_DATABASE_URL;
  }
}

// 为 createClient() 设置非池化连接
if (!process.env.POSTGRES_URL_NON_POOLING) {
  if (process.env.wboke_POSTGRES_URL) {
    process.env.POSTGRES_URL_NON_POOLING = process.env.wboke_POSTGRES_URL;
  } else if (process.env.wboke_DATABASE_URL) {
    process.env.POSTGRES_URL_NON_POOLING = process.env.wboke_DATABASE_URL;
  }
}

console.log('[setup-env] POSTGRES_URL configured:', !!process.env.POSTGRES_URL);
console.log('[setup-env] POSTGRES_URL_NON_POOLING configured:', !!process.env.POSTGRES_URL_NON_POOLING);

export default {};
