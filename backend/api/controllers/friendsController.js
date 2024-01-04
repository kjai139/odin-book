const User = require('../../models/userModel')


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

        res.json({
            updatedPending: theUser.friendReq
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}