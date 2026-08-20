import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, isAbsolute, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDirectory = fileURLToPath(new URL('./dist/', import.meta.url))
const indexFile = join(distDirectory, 'index.html')
const port = Number(process.env.PORT || 4173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile()
  } catch {
    return false
  }
}

function isInsideDistDirectory(filePath) {
  const relativePath = relative(distDirectory, filePath)
  return relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath))
}

async function resolveFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl || '/', 'http://localhost').pathname)
  const requestedFile = join(distDirectory, pathname === '/' ? 'index.html' : pathname.slice(1))

  if (isInsideDistDirectory(requestedFile) && await isFile(requestedFile)) {
    return requestedFile
  }

  // React Router needs the app shell for client-side routes.
  return indexFile
}

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url)
    const body = await readFile(filePath)
    const extension = extname(filePath).toLowerCase()

    response.writeHead(200, {
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    })
    response.end(body)
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Unable to serve the frontend.')
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`BlindMaze frontend is listening on port ${port}`)
})
