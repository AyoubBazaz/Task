const login=require('../Model/Auth/Login')
const register=require('../Model/Auth/Register')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
module.exports={    
  register: async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password ) {
            return res.status(400).send('all fields are required and must be valid.');
        }

        const existingUser = await login.findOne({ email });
        if (existingUser) {
            return res.status(400).send('a user with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new login({ email, password: hashedPassword, role });
        await newUser.save();

        const newMember = new register({ idUser: newUser._id, username });
        await newMember.save();

        res.status(201).send(newMember);
    } catch (err) {

        console.error(`error: ${err}`);
        res.status(500).send('Server error');
    }
},
show: async (req, res) => {
  try {
    const members = await register.find().populate('idUser', 'email password');
    res.json(members);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
},
// Assuming you have required necessary modules and set up the User model correctly
showId: async (req, res) => {
  const id = req.params.id;
  try {
      const user = await register.findById(id); // Corrected here to use User directly
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
},


login: async(req,res) => {
  const { email, password , role} = req.body;
  const user = await login.findOne({ email });
  if (!user) {
      return res.status(401).send('invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
      return res.status(401).send('invalid credentials');
  }

  const token = jwt.sign({ email: user.email, id: user._id, role: user.role._id }, "JWT_SECRET", {
      expiresIn: "1h",
  });

  res.json({ token, role: user.role });
},
     authorize : (roles = []) => {
      if (typeof roles === 'string') {
          roles = [roles];
      }
  
      return (req, res, next) => {
          if (!roles.length || roles.includes(req.user.role)) {
              next();
          } else {
              res.status(403).send('Forbidden');
          }
      };
  },  
    authenticateToken:(req, res, next)=> {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).send('Access denied. No token provided.');
        }
      
        try {
          const decoded = jwt.verify(token, "JWT_SECRET");
          req.user = decoded;
          next();
        } catch (ex) {
          res.status(400).send('Invalid token.');
        }
      },
      protege: async (req, res) => {
        const userId = req.user.id;
        const client = await register.findOne({ idUser: userId });
    
        if (!client) {
          return res.status(404).send(' not found');
        }
        res.json(client);
      }

}