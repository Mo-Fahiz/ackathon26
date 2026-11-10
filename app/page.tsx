import Nav from '@/components/ui/Nav';
import Cursor from '@/components/ui/Cursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import StarDust from '@/components/ui/StarDust';
import Backdrop from '@/components/three/Backdrop';
import Hero from '@/components/sections/Hero';
import Beats from '@/components/sections/Beats';
import Descent from '@/components/sections/Descent';
import Horizon from '@/components/sections/Horizon';
import OnePager from '@/components/sections/OnePager';
import Prizes from '@/components/sections/Prizes';
import Footer from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <Backdrop />
      <StarDust />
      <Nav />
      <Cursor />
      <ScrollProgress />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Beats />
        <Descent />
        <Horizon />
        <OnePager />
        <Prizes />
      </main>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </>
  );
}
