import React, { useState } from 'react';
import { NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEye, faFilm, faInfoCircle, faSignOutAlt, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import { useHistory } from 'react-router-dom';
import TabButton from './TabButton';
import homeStore from "../store/HomeStore";
import './TopTabBar.css'
import LoginModal2 from './auth/LoginModal2';
import RegisterModal2 from './auth/RegisterModal2';

const TopTabBar = ({ isAuthenticated, toggleVintage, toggleWatched, changePage, logout }) => {
  const [selected, setSelected] = useState('Home');
  const history = useHistory(); // get access to history object
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleSelect = (tab) => {
    console.log("handleSelect")
    setSelected(tab);
    switch (tab) {
      case 'Home':
        console.log("handleSelect, Home")
        history.push('/');
        break;
      case 'Watched':
        history.push('/watched');
        break;
      case 'Mode':
        homeStore.toggleVintageMode();  // Toggle the MobX observable for vintageMode
        console.log("handleSelect, Vintage")
        changePage(homeStore.currentPage, true);
        history.push('/');
        break;
      case 'About':
        console.log("handleSelect, About")
        history.push('/about');
        break;
      case 'Logout':
        console.log("handleSelect, Logout")
        // history.push('/');
        logout();
        break;
      case 'Login':
        console.log("handleSelect, Login")
        setIsLoginModalOpen(true)
        break;
      case 'Register':
        console.log("handleSelect, Register")
        setIsRegisterModalOpen(true)
        break;
      default:
        break;
    }
  };

  const renderTabs = () => {
    if (isAuthenticated) {
      return (
        <>
          <TabButton icon={faHome} text="Home" isSelected={selected === 'Home'} onClick={() => handleSelect('Home')} handleSelect={handleSelect} />
          <TabButton icon={faEye} text="Watched" isSelected={selected === 'Watched'} onClick={() => handleSelect('Watched')} handleSelect={handleSelect} />
          <TabButton icon={faFilm} text="Mode" isSelected={selected === 'Mode'} onClick={() => handleSelect('Mode')} handleSelect={handleSelect} />
          <TabButton icon={faInfoCircle} text="About" isSelected={selected === 'About'} onClick={() => handleSelect('About')} handleSelect={handleSelect} />
          <TabButton icon={faSignOutAlt} text="Logout" isSelected={selected === 'Logout'} onClick={() => handleSelect('Logout')} handleSelect={handleSelect} />
        </>
      );
    } else {
      return (
        <>
          <TabButton icon={faSignInAlt} text="Login" isSelected={selected === 'Login'} onClick={() => handleSelect('Login')} handleSelect={handleSelect} />
          <TabButton icon={faUserPlus} text="Register" isSelected={selected === 'Register'} onClick={() => handleSelect('Register')} handleSelect={handleSelect} />
          <TabButton icon={faInfoCircle} text="About" isSelected={selected === 'About'} onClick={() => handleSelect('About')} handleSelect={handleSelect} />
        </>
      );
    }
  };

  return (
    <div className="tab-bar">
      {renderTabs()}
      <LoginModal2 isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <RegisterModal2 isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </div>
  );
};

export default connect(null, { logout })(TopTabBar);
