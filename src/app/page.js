import Footer from "@/components/Footer";
import Menubar from "@/components/Menubar";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className=" flex flex-col justify-center items-center min-h-screen bg-background">
        <Menubar />
      </main>
      <Footer />
    </>
  );
}
