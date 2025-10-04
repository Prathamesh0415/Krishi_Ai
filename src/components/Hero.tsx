"use client"

import Image from "next/image"
export default function HeroSection() {
return (
<>
  <section className="py-4 mt-14 sm:mt16 lg:mt-0">
    <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 grid lg:grid-cols-2 lg:items-center gap-10 pt-20">
      <div className="flex flex-col space-y-8 sm:space-y-10 lg:items-center text-center lg:text-left max-w-2xl md:max-w-3xl mx-auto">
        <h1 className=" font-semibold leading-tight text-teal-950 dark:text-white text-4xl sm:text-5xl lg:text-6xl">
          Let us help you nurture <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-700">your crops.</span>
        </h1>
        <p className=" flex text-gray-700 dark:text-gray-300 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
          Farming requires dedication, patience, and careful planning to ensure every seed grows into a healthy crop. We provide farmers with the guidance, tools, and support needed to manage their fields efficiently, improve yields, and protect their livelihood. By combining modern techniques with practical insights, we help make farming simpler, more productive, and rewarding for everyone.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
          <a href="#" className="px-6 items-center h-12 rounded-3xl bg-gradient-to-br from-green-500 to-green-700 text-white duration-300 ease-linear flex justify-center w-full sm:w-auto">
            Get started
          </a>
        </div>
      </div>
      <div className="flex aspect-square lg:aspect-auto lg:h-[35rem] relative">

        <div className="w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30 relative">
        <Image
            src="/images/wheat-farm.jpg"
            alt="field-image"
            fill
            className="object-cover"
        />
        </div>
        <div className="absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10">
          <Image
                src="/images/farmer.jpg"
                alt="farmer-image"
                fill
                className="object-cover"
            />
        </div>
      </div>
    </div>
  </section>
</>
)
}