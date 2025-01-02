import Menubar from "@/components/Menubar";
import { Button } from "@/components/ui/button";
import { Chrome, RabbitIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className=" flex flex-col justify-center items-center min-h-screen bg-background">
        <Menubar />

        <div className="flex gap-4 mt-8">
          <Link href={"/#PlannedPhase"}>
            <Button> <Chrome className="mr-2"/> Chrome Extension</Button>
          </Link>
          <Link href={"/about"}>
            <Button> <RabbitIcon className="mr-2"/> About</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
