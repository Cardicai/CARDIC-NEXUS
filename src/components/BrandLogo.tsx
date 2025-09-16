import Image from "next/image";
import React from "react";

export default function BrandLogo() {
  return (
    <Image
      src="/images/cardic-nexus-header.png"
      alt="Cardic Nexus Logo"
      width={160}   // adjust size as needed
      height={60}
      priority
    />
  );
}
