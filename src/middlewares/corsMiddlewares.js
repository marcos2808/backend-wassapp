import cors from 'cors'

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  cors({credentials: true, origin: true})(req, res, next)
}

export default corsMiddleware;