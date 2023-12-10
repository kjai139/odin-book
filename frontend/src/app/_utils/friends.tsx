
import axiosInstance from '../../../axios'

const addFriend = async (id:string, userId:string) => {
    try {
        const response = await axiosInstance.post('api/user/addfrd', {
            id: id,
            userId: userId
        }, {
            withCredentials: true
        })

        if (response.data.success) {
            return response
        } else {
            return response
        }
    } catch (err) {
        console.log('Error adding friends: ', err)
        return {
            data: {
                message: err
            }
        }
    }
}


export { addFriend }


