$postgresUrl = "postgres://83d6bdb46126f946e46d3db6b39be22bfd315ff41b1c3a04c67d9a4db7f9101b:sk_zcun4UEPzlvIjP3WKFnHm@db.prisma.io:5432/postgres?sslmode=require"

# Use echo to pipe the value and answer 'y' to the sensitive prompt
$process = Start-Process -FilePath "vercel" -ArgumentList "env", "add", "POSTGRES_URL" -NoNewWindow -PassThru -RedirectStandardInput "set-env-input.txt"

# Wait for the process to complete
$process.WaitForExit()
