const express = require('express')
const models = require('../models/index')

const getAllUser = async (req, res) => {
    const User = await models.User.findAll({});
    res.status(200).send({
        status: 200,
        message: 'Berhasil GET data user',
        data: User
    });
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        await models.User.destroy({
            where: {
                id: id
            }
        });

        res.status(200).send({ status: 200, message: "User berhasil di hapus"})
    } catch (error) {
        res.status(500).send({ status: 500, message: error.message});
    }
};

const getUserbyEmail = async (val) => await models.User.findOne({ where: {email: val} })

const getRoleUser = async (id) => await models.User.findOne({ attributes: ['role'], where: {id: id} })

const getProfileInformation = async (req, res) => {
    try {
        const userId = req.user_id

        const users = await models.User.findOne({
            where: {
                id : userId
            }
        }) 
        res.status(200).send({
                status : 200,
                message : `success get profile user dengan id : ${userId}`,
                data : users
            })
    } catch(error) {
        res.status(500).send({
            status : 500,
            message : error.message
        })
    }
}


module.exports = { getAllUser, deleteUser, getUserbyEmail, getRoleUser, getProfileInformation };
