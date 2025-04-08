const jwt = require('jsonwebtoken');
const SECRET = "secretKeyOwner";

function authenticateOwner(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: 'חסר טוקן' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'טוקן לא תקף' });

    req.owner = user;
    next();
  });
}

module.exports = authenticateOwner;
