import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backup directory exists
const backupDir = path.join(__dirname, '../../backup/full');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const fullBackup = (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
    const backupFile = `backup_${timestamp}.sql`;
    const backupPath = path.join(backupDir, backupFile);

    const dbHost = process.env.DB_HOST || '100.87.131.70';
    const dbUser = process.env.DB_USER || 'ts_user';
    const dbPassword = process.env.DB_PASSWORD || 'secret123';
    const dbName = process.env.DB_NAME || 'g1_supermarket';
    const dbPort = process.env.DB_PORT || '3306';

    const dumpCommand = `mysqldump -h${dbHost} -P${dbPort} -u${dbUser} ${dbPassword ? '-p' + dbPassword : ''} ${dbName} > "${backupPath}"`;

    // Debug logs
    console.log('DB_HOST:', dbHost, 'DB_PORT:', dbPort, 'DB_USER:', dbUser, 'DB_NAME:', dbName);
    console.log('Dump command:', dumpCommand);

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Backup error:', error);
            return res.status(500).json({ message: 'Backup failed', error: stderr });
        }
        res.download(backupPath, backupFile, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
        });
    });
};

export default {
    fullBackup
}; 