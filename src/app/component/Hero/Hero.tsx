function Hero() {
  return (
    <div className=" flex flex-row items-center justify-center relative">
      <img
        src="images/ak_hero_banner.jpg"
        alt="el_cartel_banner"
        className="w-full h-200 object-cover object-center"
      />
      <div className="absolute bottom-0 left-50% transform-[-50%,50%] flex-col flex justify-center items-center">
        <img
          src="images/elcartel-logo.png"
          alt="el_cartel_logo"
          className="w-50"
        />
        <div className="text-center">
          <h1 className="font-hero text-[#FDCB84]">El Cartel</h1>
          <p className="font-body text-[#FEF9D1]">
            Certified Skin Remodeler for your Ak-47
          </p>
        </div>
      </div>
    </div>
  );
}
export default Hero;
