import { Router } from 'express'
import prisma from '../database/client.js'
const router = Router()

/* GET home page. */
router.get('/', function (req, res) {
  res.send('Hello World!')
})
router.get('/keep-alive', async function(req, res){
  try{
    await prisma.user.count()
    res.status(204).end()
  }
  catch(error){
    console.error(error)

    res.status(500).end()
  }
}
)
export default router
