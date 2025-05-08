import Navbar from '../components/navbar'
import { useAuth } from '../components/authoContext';
import '../css/profil.css'

function Profil() {
    const {user} = useAuth();

    if(!user){
        return <p>Пожалуйста, войдите в свою учетную запись для просмотра профиля.</p>;
    }

    return (
        <div>
            <Navbar />

            <div className="profile-container">
                <h1>Ваш Профиль</h1>
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Сотовый номер:</strong> {user.phone}</p>
                <p><strong>Электронная почта:</strong> {user.email}</p>
            </div>
        </div>
    )
}

export default Profil;