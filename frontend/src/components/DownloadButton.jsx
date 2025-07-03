import React, { useState } from "react";
import axios from "axios";
import downloadIcon from "../assets/Downlaod_icon.png";

const styles = `
  .download-button {
    padding: 10px 20px;
    background-color: #39BF44;
    color: white;
    display: flex;
    border: none;
    gap: 10px;
    cursor: pointer;
    font-family: Minecraft;
    font-size: 16px;
  }

  .download-button:disabled {
    cursor: not-allowed;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const DownloadButton = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);

  const triggerDownload = (url, index, total) => {
    setDownloadStatus(`Downloading file ${index + 1} of ${total}...`);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    if (index === total - 1) {
      setTimeout(() => {
        setDownloadStatus('All files have been processed');
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    setDownloadStatus('Fetching download links...');
    try {
      const response = await fetch('http://192.168.29.13:4000/api/mods/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-api-key": "1234567890_SECRET_KEY_MODS_CRAFT",
        },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }      
      const data = await response.json();
      if (data.status === 200 && data.downloadUrls && data.downloadUrls.length > 0) {
        setDownloadStatus(`Found ${data.downloadUrls.length} files to download`);   
        data.downloadUrls.forEach((url, index) => {
          setTimeout(() => {
            triggerDownload(url, index, data.downloadUrls.length);
          }, index * 1000);
        });
      } else {
        throw new Error('No download URLs available');
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleDownload} 
        disabled={isLoading}
        className="download-button"
      >
        <img src={downloadIcon} alt='download icon' />
        {isLoading ? 'Processing...' : 'Download'}
      </button>
      
    </div>
  );
};

export default DownloadButton; 