import fs from 'fs';
import path from 'path';

function motionCanvasNarratorPlugin(options = {}) {
    const { audioPath = 'narrator-cache', maxFileSize = 50, // 50MB default
    allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'], } = options;
    return {
        name: 'motion-canvas-narrator:audio-storage',
        configureServer(server) {
            // Ensure audio directory exists
            if (!fs.existsSync(audioPath)) {
                fs.mkdirSync(audioPath, { recursive: true });
            }
            // WebSocket handler for audio uploads
            server.ws.on('narrator:upload-audio', async (message, client) => {
                try {
                    const { data, mimeType, cacheKey, duration, metadata } = message;
                    // Validate mime type
                    if (!allowedMimeTypes.includes(mimeType)) {
                        client.send('narrator:upload-error', {
                            error: `Unsupported mime type: ${mimeType}`,
                            cacheKey,
                        });
                        return;
                    }
                    // Validate file size
                    const base64Data = data.slice(data.indexOf(',') + 1);
                    const bufferData = Buffer.from(base64Data, 'base64');
                    const fileSizeMB = bufferData.length / (1024 * 1024);
                    if (fileSizeMB > maxFileSize) {
                        client.send('narrator:upload-error', {
                            error: `File too large: ${fileSizeMB.toFixed(2)}MB (max: ${maxFileSize}MB)`,
                            cacheKey,
                        });
                        return;
                    }
                    // Generate file extension from mime type
                    const extension = getExtensionFromMimeType(mimeType);
                    // Create file path using cache key as filename
                    const fileName = `${cacheKey}.${extension}`;
                    const filePath = path.join(audioPath, fileName);
                    // Write audio file
                    await writeAudioFile(filePath, bufferData);
                    // Create metadata file
                    const metadataPath = path.join(audioPath, `${cacheKey}.meta.json`);
                    const metadataContent = {
                        cacheKey,
                        duration,
                        mimeType,
                        fileSize: bufferData.length,
                        fileName,
                        createdAt: new Date().toISOString(),
                        ...metadata,
                    };
                    await fs.promises.writeFile(metadataPath, JSON.stringify(metadataContent, null, 2));
                    // Send success response
                    client.send('narrator:upload-success', {
                        cacheKey,
                        filePath: '/' + filePath,
                        duration,
                        size: bufferData.length,
                    });
                    console.log(`Audio file cached: ${filePath} (${fileSizeMB.toFixed(2)}MB)`);
                }
                catch (error) {
                    console.error('Audio upload error:', error);
                    client.send('narrator:upload-error', {
                        error: error instanceof Error ? error.message : 'Unknown error',
                        cacheKey: message.cacheKey,
                    });
                }
            });
            // WebSocket handler for checking if plugin is available
            server.ws.on('narrator:check-available', (message, client) => {
                client.send('narrator:available', {});
            });
            // WebSocket handler for checking if audio exists
            server.ws.on('narrator:check-audio', async (message, client) => {
                try {
                    const { cacheKey } = message;
                    const extension = 'mp3'; // Default to mp3, could be made smarter, TODO: read extensioin from metadata
                    const fileName = `${cacheKey}.${extension}`;
                    const filePath = path.join(audioPath, fileName);
                    const metadataPath = path.join(audioPath, `${cacheKey}.meta.json`);
                    if (fs.existsSync(filePath) && fs.existsSync(metadataPath)) {
                        const metadata = JSON.parse(await fs.promises.readFile(metadataPath, 'utf8'));
                        client.send('narrator:audio-exists', {
                            cacheKey,
                            filePath: '/' + filePath,
                            duration: metadata.duration,
                            metadata,
                        });
                    }
                    else {
                        client.send('narrator:audio-not-found', { cacheKey });
                    }
                }
                catch (error) {
                    console.error('Audio check error:', error);
                    client.send('narrator:audio-not-found', {
                        cacheKey: message.cacheKey,
                    });
                }
            });
        },
    };
}
function getExtensionFromMimeType(mimeType) {
    const extensions = {
        'audio/mpeg': 'mp3',
        'audio/mp3': 'mp3',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg',
        'audio/webm': 'webm',
    };
    return extensions[mimeType] || 'mp3';
}
function writeAudioFile(filePath, buffer) {
    return new Promise((resolve, reject) => {
        fs.createWriteStream(filePath)
            .on('finish', resolve)
            .on('error', reject)
            .end(buffer);
    });
}

export { motionCanvasNarratorPlugin };
//# sourceMappingURL=vite-plugin.js.map
