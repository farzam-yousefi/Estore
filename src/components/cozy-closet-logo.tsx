import Image from "next/image";
import { lusitana } from "./ui/fonts";
export default function CozyClosetLogo() {
  return (
    <div
      className={`${lusitana.className} flex items-center gap-3 sm:gap-5 text-white`}
    >
      <Image
        src="/logo.webp"
        alt="logo"
        width={70}
        height={70}
        className="h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-sm"
      />
      <p className="text-xl sm:text-3xl md:text-[44px] leading-none whitespace-nowrap">
        Cozy Closet
      </p>
    </div>
  );
}
