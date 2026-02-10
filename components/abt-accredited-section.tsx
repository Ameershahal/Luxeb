export function AbtAccreditedSection() {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-white text-black">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 sm:gap-6 text-center">
        <p className="text-sm sm:text-base max-w-3xl">
          Officially Accredited by ABT - Ensuring that every course we offer meets the highest levels of quality,
          trust, and professional recognition.
        </p>
        <img
          src="/atb.png"
          alt="ABT Accredited"
          className="h-12 sm:h-16 w-auto object-contain"
        />
      </div>
    </section>
  )
}

