
import { io } from 'socket.io-client'
import readline from 'node:readline/promises'

const sessionResponse = await fetch('http://localhost:3001/dev/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'collector-test' }),
})

const { token } = await sessionResponse.json()

const socket = io('http://localhost:3001', {
  auth: { token },
})

socket.on('connect', () => {
  console.log('Conectado ao Socket.IO!')
  console.log('Aguardando eventos nft.updated...\n')
})

socket.on('connect_error', (error) => {
  console.error('Erro de conexão:', error.message)
})

socket.on('nft.updated', (event) => {
  console.log('EVENTO RECEBIDO: nft.updated')
  console.log(JSON.stringify(event, null, 2))
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

await rl.question('Pressione ENTER para encerrar o teste...')
socket.disconnect()
rl.close()
