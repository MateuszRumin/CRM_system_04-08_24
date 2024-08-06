import { useEffect, useState } from 'react'
import axios from 'axios'
import profile from '../../assets/TopBarIcons/profile.png'
import styles from './Profile.module.css'
import { ChangeDataProfile } from './ChangeDataProfile/ChangeDataProfile'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  userId: number;
  role: string;
}

interface UserData {
  first_name: string;
  second_name: string;
}

export const Profile = () => {
  const [openModal, setOpenModal] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token)
        const userId = decodedToken.userId

        // Pobranie danych użytkownika za pomocą axios
        axios.get(`http://localhost:3000/employees/${userId}`)
          .then(response => {
            const data = response.data

            // Zakładamy, że dane użytkownika znajdują się w data.UserData[0]
            if (data.UserData.length > 0) {
              setUserData({
                first_name: data.UserData[0].first_name,
                second_name: data.UserData[0].second_name
              })
            }
          })
          .catch(error => console.error('Error fetching user data:', error))
          .finally(() => setLoading(false)) // Ustawienie loading na false po zakończeniu pobierania
      } catch (error) {
        console.error('Invalid token:', error)
        setLoading(false)
      }
    }
  }, [])

  return (
    <>
      <div className={styles.profile}>
        <span>{loading ? 'Loading...' : (userData ? `${userData.first_name} ${userData.second_name}` : 'User data not found')}</span>
        <button onClick={() => setOpenModal(true)} className={styles.btnProfile}>
          <img src={profile} alt="zdjęcie profilowe" />
        </button>
      </div>
      {openModal && <ChangeDataProfile onClose={() => setOpenModal(false)} />}
    </>
  )
}
