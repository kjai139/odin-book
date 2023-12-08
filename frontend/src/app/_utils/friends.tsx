
import axiosInstance from '../../../axios'

const addFriend = async (id:string) => {
    try {
        const response = await axiosInstance.post('api/user/addfrd', {
            id: id
        }, {
            withCredentials: true
        })

        if (response.data.success) {
            return response
        } else {
            return null
        }
    } catch (err) {
        console.log('Error adding friends: ', err)
        return null
    }
}


export { addFriend }


