import dynamic from 'next/dynamic';
import Todo from '../components/todo/todo';

const Header = dynamic(() => import('header/header'), { ssr: true });
const Footer = dynamic(() => import('footer/footer'), { ssr: true });

export function Index() {
  return (
    <section className="flex flex-col justify-between min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center py-16 max-w-2xl mx-auto">
        <Todo />
      </main>
      <Footer />
    </section>
  );
}

export default Index;
