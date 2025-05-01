import { createServer } from 'node:http';
import { createWriteStream } from 'node:fs';
import { readFile } from 'node:fs';
import { URL } from 'url';
import { join } from 'path'; 

const logStream = createWriteStream('log.txt', { flags: 'a' });
const server = createServer((req, res) => {
    const reqUrl = new URL(req.url, 'http://localhost');
    const pathname = reqUrl.pathname; 

    
    const clientIP = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const logEntry = `Time: ${new Date().toISOString()}, IP: ${clientIP}, User-Agent: ${userAgent}, Pathname: ${pathname}\n`;
    logStream.write(logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
          
        }
    });

    switch (pathname) { 
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
            res.end('<h1 style="font-size: 24px; font-weight: bold;">Selling banana, humans!</h1>');
            break;

        case '/user':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
            res.end('<h1 style="font-size: 24px; font-weight: bold;">Joking not bananas</h1>');
            break;

        case '/favicon.ico':
            
            const faviconPath = join(__dirname, 'favicon.ico'); 
            readFile(faviconPath, (err, data) => {
                if (err) {
                    console.error('Error loading favicon:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Error loading favicon.ico\n');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
            });
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); 
            res.end('<h1 style="font-size: 24px; font-weight: bold;">404 not found</h1>');
            break;
    }
});

server.listen(4000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:4000');
});