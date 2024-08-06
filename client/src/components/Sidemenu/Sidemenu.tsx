import { NavLink } from 'react-router-dom';
import styles from './Sidemenu.module.css';
import { useUser } from '../../contexts/UserContext';

const menuItems = [
  {
    name: 'Strona główna',
    path: '/',
    icon: 'home.svg',
    roles: ['Admin', 'User'],
  },
  {
    name: 'Kreator',
    path: '/kreator',
    icon: 'Add_To_Queue.svg',
    roles: ['Admin'],
  },
  {
    name: 'Faktury',
    path: '/faktury',
    icon: 'Note.svg',
    roles: ['Admin'],
  },
  {
    name: 'Umowy',
    path: '/umowy',
    icon: 'Notebook.svg',
    roles: ['Admin'],
  },
  {
    name: 'Projekty',
    path: '/projekty',
    icon: 'Vector.svg',
    roles: ['Admin'],
  },
  {
    name: 'Pracownicy',
    path: '/pracownicy',
    icon: 'Users_Group.svg',
    roles: ['Admin'],
  },
  {
    name: 'Uprawnienia',
    path: '/uprawnienia',
    icon: 'Shield_Warning.svg',
    roles: ['Admin'],
  },
  {
    name: 'Klienci',
    path: '/klienci',
    icon: 'Customer.svg',
    roles: ['Admin'],
  },
];

export const Sidemenu = () => {
  const { user } = useUser(); 
  console.log('User in Sidemenu:', user); 

  return (
    <ul className={styles.sidemenu}>
      {menuItems
        .filter(item => item.roles.includes(user?.role || ''))
        .map(item => (
          <li key={item.path}>
            <NavLink className={styles.item} to={item.path}>
              <img className={styles.iconItem} src={`/menu_icons/${item.icon}`} alt={item.name} />
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
    </ul>
  );
};
