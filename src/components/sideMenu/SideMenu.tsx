import './SideMenu.scss';
import { Home, Layout, User, Search } from '../../assets/icons';

export const SideMenu = () => {
  return (
    <div className='side-menu'>
      <div className='side-menu__item'>
        <Home />
        Dashboard
      </div>
      <div className='side-menu__item side-menu__item--active'>
        <Layout />
        Boards
      </div>
      <div className='side-menu__item'>
        <User />
        Profile
      </div>
      <div className='side-menu__item'>
        <Search />
        Search
      </div>
    </div>
  );
}
