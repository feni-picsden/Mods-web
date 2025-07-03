import sftpConfig from 'ssh2-sftp-client';

const sftp = new sftpConfig();

const FTP_CONFIG = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD
};

async function connectSFTP() {
  try {
    if (!sftp.sftp) {
      await sftp.connect(FTP_CONFIG);
      console.log("✅ SFTP Connected Successfully");
    }
  } catch (error) {
    console.error("❌ SFTP Connection Error:", error);
  }
}

async function downloadFile(remotePath, localPath) {
  try {
    await connectSFTP();
    await sftp.get(remotePath, localPath);
    console.log(`✅ Downloaded ${remotePath} to ${localPath}`);
  } catch (err) {
    console.error('❌ SFTP Download Error:', err);
    throw err;
  } finally {
    await sftp.end();
  }
}

export { downloadFile };