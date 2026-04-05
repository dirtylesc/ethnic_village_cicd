import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, PhoneCall, Twitter } from 'lucide-react';

const FooterLogo: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 md:max-w-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white md:h-20 md:w-20">
        <Image src="/icons/logo.svg" alt="Travo Logo" width={80} height={80} className="object-contain" />
      </div>
      <div className="flex gap-5">
        <Link href="https://facebook.com" aria-label="Facebook">
          <Facebook className="h-5 w-5 text-gray-500 md:h-6 md:w-6" />
        </Link>
        <Link href="https://instagram.com" aria-label="Instagram">
          <Instagram className="h-5 w-5 text-gray-500 md:h-6 md:w-6" />
        </Link>
        <Link href="https://twitter.com" aria-label="Twitter">
          <Twitter className="h-5 w-5 text-gray-500 md:h-6 md:w-6" />
        </Link>
      </div>

      <div className="mt-2 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <PhoneCall className="h-5 w-5 text-gray-500 md:h-6 md:w-6" />
          <span className="text-sm md:text-base">(620) 555-0127</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Mail className="h-5 w-5 text-gray-500 md:h-6 md:w-6" />
          <span className="text-sm md:text-base">travo@example.com</span>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin className="h-5 w-5 text-gray-500 md:h-6 md:w-6" />
          <span className="text-sm md:text-base">3891 Ranchview Dr. Richardson, California 62639333</span>
        </div>
      </div>
    </div>
  );
};

export default FooterLogo;
