import Nav from '@/components/ui/Nav';
import Cursor from '@/components/ui/Cursor';
import StarDust from '@/components/ui/StarDust';
import Backdrop from '@/components/three/Backdrop';
import Hero from '@/components/sections/Hero';
import Beats from '@/components/sections/Beats';
import Descent from '@/components/sections/Descent';
import Horizon from '@/components/sections/Horizon';
import OnePager from '@/components/sections/OnePager';
import Scoring from '@/components/sections/Scoring';
import Footer from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <Backdrop />
      <StarDust />
      <Nav />
      <Cursor />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Beats />
        <Descent />
        <Horizon />
        <OnePager />
        <Scoring />
      </main>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </>
  );
}
