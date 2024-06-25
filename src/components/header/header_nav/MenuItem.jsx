import { Link, NavLink } from "react-router-dom";
import { FcAssistant } from "react-icons/fc";
import { useSelector } from "react-redux";
import newItem from '../../../assets/new.png'
const MenuItem = ({ item ,setOpenBurger}) => {
  const userData = useSelector((state) => state.auth.data);

  return (
    <>
      <NavLink to={item.link} onClick={()=>setOpenBurger(false)}>
        <div className={item.submenu ? "menu__item submenu" : "menu__item"}>
{item.isNew &&           <div className="new__img">
            <img src={newItem} alt="new" />
          </div>}
          <div>{item.icon}</div>
          {item.label}

          {item.submenu && (
            <div className={"submenu__items"}>
              {item.submenu &&
                item.submenu.map((item, idx) => {
                  return (
                    <div key={idx + 1} className="submenu__item">
                      <Link to={item.link}>{item.label}</Link>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </NavLink>
    </>
  );
};

export default MenuItem;
