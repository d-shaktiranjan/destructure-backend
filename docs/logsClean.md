# Logs clean

This project provides scripts to manage and clean log files and database logs. Over time, log files can grow large and take up unnecessary space, so this utility helps keep things organized.

## Clean logs file

This command will delete all log files in your file-based logging system. Use this when you want to remove all log files from your system.

```bash
pnpm clean-logs file
```

## Clean logs from DB

This command will remove all logs stored in the database. Use this with caution, as once removed, the logs cannot be recovered unless a backup is available.

```bash
pnpm clean-logs db
```

> [!WARNING]  
> These commands will permanently delete the logs. Ensure you have a backup if needed before executing them.
