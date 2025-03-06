import authService from '../backend/auth'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout as authLogout } from '../store/authSlice';

function LogoutBtn() {

    const dispatch = useDispatch();
    const navigate =  useNavigate();
    const logoutHandler = () => {
        authService.logout()
        .then(() => {
            dispatch(authLogout())
            navigate('/')
        })
    }
    return (
        <button
           className="px-8 py-3 text-lg font-medium text-gray-800 bg-white rounded-xl shadow-lg 
           hover:bg-gradient-to-r hover:from-blue-300 hover:to-purple-400 hover:text-white 
           transition-all duration-300 transform hover:scale-105"
           onClick={logoutHandler}
        >
          Logout
        </button>
    )
}

export default LogoutBtn
