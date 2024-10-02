import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TabButton = ({ icon, text, isSelected, onClick }) => {
  return (
    <div className={`tab-button ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} size="3x" />
      <span className="tab-text">{text}</span>
    </div>
  );
};

export default TabButton
