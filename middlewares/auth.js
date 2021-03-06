const { check } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const models = require('../models')
const User = require('../controllers/UserController')

// validasi input saat registrasi
const registerValidation = [
    check('nama').not().isEmpty().withMessage('Nama harus diisi').isLength({ min: 4, max: 254 }),
    check('email').not().isEmpty().withMessage('Email harus diisi').isEmail().custom( val => {
        // mengecek email apakah sudah digunakan
        return User.getUserbyEmail(val).then( user => {
            if(user) {
                return Promise.reject('Email sudah digunakan')
            }
        })
    }),
    check('password').not().isEmpty().withMessage('Password harus diisi').isAlphanumeric(),
    check('role').not().isEmpty().withMessage('Role harus diisi').isIn(['admin', 'user'])
];

// validasi input saat login
const loginValidation = [
    check('email').not().isEmpty().withMessage('Email harus diisi').isEmail(),
    check('password').not().isEmpty().withMessage('Password harus diisi').isAlphanumeric()
];

const authenticateJWT = async (req, res, next) => {
    try {
        // mengambil request client dengan authorizationnya (token)
        const authHeader = req.headers.authorization;
    
        if (authHeader) {
            // mengambil token saja
            const token = authHeader.split(' ')[1];
    
            // mengecek apakah token sudah pernah digunakan atau belum
            const cekBlacklist = await models.Blacklist.findOne({ where: { token: token }})

            console.log(cekBlacklist)
            if(cekBlacklist)
            {
                return res.status(401).send({
                    status: 401,
                    message: "Token sudah tidak dapat digunakan. Silahkan melakukan login kembali"
                })
            }
    
            // verifikasi token
            jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
                if (err) {
                    return res.status(403).send({
                        status: 403,
                        message: "Token tidak valid"
                    })
                }
                
                // decode payload untuk mengambil user id
                const payload = jwt.decode(token, { complete: true })
                req.user_id = payload.payload.userToken.id
                
                next();
            });
        } else {
            res.status(401).send({
                status: 401,
                message: "Masukkan token untuk mengakses"
            });
        }
    } catch(err) {
        console.log(err)
        res.status(422).send({
            status: 422,
            message: err
        })
    }
};

// validasi role akun
const roleValidation = function(role) {
    return async (req, res, next) => {
        try {
            const data = await User.getRoleUser(req.user_id)
            const roleUser = data.dataValues.role
    
            if(roleUser != role)
            {
                res.status(401).send({
                    code: 401,
                    message: "Kamu tidak memiliki hak akses"
                })
            }
    
            next()
        } catch(err) {
            console.log(err)
            res.status(402).send({
                code: 402,
                message: err
            })
        }
    }
}

module.exports = {
    registerValidation,
    loginValidation,
    authenticateJWT,
    roleValidation
};