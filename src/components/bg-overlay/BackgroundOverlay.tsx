const BackgroundOverlay: React.FC = ({}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.jpeg)" }}
      >
        <img
          src="/images/alt-logo.png"
          className="invisible absolute bottom-6 right-6 w-[175px] drop-shadow-text md:visible"
        />
      </div>
    </>
  );
};

export default BackgroundOverlay;
