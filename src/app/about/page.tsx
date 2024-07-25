export default function About() {
  return (
    <div className="flex w-screen flex-col items-center justify-center pt-135 text-center">
      <h1 className="w-85vw font-bigola text-4xl text-customCream lg:w-50vw lg:text-5xl xl:w-45vw xxl:w-40vw">
        About coming soon...
      </h1>
      <p className="w-85vw py-3 font-hypatia text-xl lg:w-50vw lg:text-2xl xl:w-45vw xxl:w-40vw">
        Write whatever you want here. This is simple copy/paste for me when you
        write it up.
      </p>
      <div className="mt-5 border-4 border-solid border-customGold">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118.9963546287295!2d-121.50463458858096!3d38.57993176525615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ad12b9928b091%3A0x8fd24ebe337fbfe7!2sLegend%20Has%20It!5e0!3m2!1sen!2sus!4v1721929967965!5m2!1sen!2sus"
          width="400"
          height="300"
          loading="lazy"
          className="w-75vw lg:w-25vw xl:w-25vw xxl:w-25vw"
        ></iframe>
      </div>
    </div>
  );
}
