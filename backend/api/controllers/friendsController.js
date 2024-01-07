const User = require('../../models/userModel')
const socketIoConfig = require('../socket')

exports.friendsRequest_accept_post = async (req, res) => {
    const targetId = req.body.targetId
    try {
        const theUser = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: {
                friendlist: targetId
            },
            $pull: {
                friendReq: targetId
            }

        }, {
            new: true
        }).populate('friendReq')

        const theTarget = await User.findByIdAndUpdate(targetId, {
            $addToSet: {
                friendlist: req.user._id
            },
            $pull: {
                friendReq: req.user._id
            }

        }, {
            new: true
        }).populate('friendReq')

        res.json({
            updatedPending: theUser.friendReq
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.friendReq_decline_post = async (req, res) => {
    try {
        const { targetId } = req.body
        const theUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                friendReq: targetId
            }
        }, {
            new: true
        }).populate('friendReq')

        res.json({
            updatedPending: theUser.friendReq
        })



    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.friendsDelete_post = async (req, res) => {
    try {
        const { friendId } = req.body
        const theUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                friendlist: friendId
            }
        }, {
            new: true
        }).populate('friendlist')

        const theFriend = await User.findByIdAndUpdate(friendId, {
            $pull: {
                friendlist: req.user._id
            }
        }, {
            new: true
        }).populate('friendlist')

        socketIoConfig.io.to(friendId).emit('frdRemoved', {
            updatedFriendlist: theFriend.friendlist
        })

        

        res.json({
            updatedFrds: theUser.friendlist
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}