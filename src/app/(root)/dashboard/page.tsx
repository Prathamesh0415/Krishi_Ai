import Hero from "@/components/Hero"
import ContactUs1 from "@/components/mvpblocks/contact-us-1"
import FooterAnimated from "@/components/mvpblocks/footer-animated"
import Header1 from "@/components/mvpblocks/header-1"
import TestimonialsCarousel from "@/components/mvpblocks/testimonials-carousel"

export default function Page() {
    return (
        <>      
               <div className="relative bg-gradient-to-br from-green-800/90 via-emerald-900/90 to-teal-900/90">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 to-emerald-900/60"></div>
                <div className="relative z-10">
                    <Header1 />
                    <Hero />
                    <TestimonialsCarousel />
                    <ContactUs1 />
                    <FooterAnimated />
                </div>
            </div>
     
        </>
    )
}