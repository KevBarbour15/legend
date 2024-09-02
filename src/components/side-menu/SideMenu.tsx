const SideMenu: React.FC = ({}) => {
  return (
    <>
      <div className="fixed h-full w-full px-[5vw] py-[5vh]">
        <ul className="font-bigola text-[48px] uppercase">
          <li>About</li>
          <li>Events</li>
          <li>Contact</li>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;
