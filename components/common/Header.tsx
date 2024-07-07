import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex justify-between items-center border-b-2 p-3">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/imageIcon.png"
          className="sm:w-14 sm:h-14 w-9 h-9"
          width={36}
          height={36}
        />
        <p className="text-3xl font-bold ml-2 tracking-tight content-center">
          kresface.io.vn
        </p>
      </Link>

      <a
        href="https://vercel.com/templates/next.js/ai-photo-restorer"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          alt="Vercel Icon"
          src="/vercelLogo.png"
          className="sm:w-10 sm:h-[34px] w-8 h-[28px]"
          width={32}
          height={28}
        />
      </a>
    </header>
  );
};
