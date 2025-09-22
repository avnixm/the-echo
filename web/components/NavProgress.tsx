"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(20);
    const t1 = setTimeout(() => setProgress(60), 80);
    const t2 = setTimeout(() => setProgress(85), 150);
    const t3 = setTimeout(() => setProgress(100), 300);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      setProgress(0);
    };
  }, [pathname]);

  return (
    <div className="fixed left-0 top-0 w-full h-0.5 z-[100]">
      <div className="h-full bg-blue-600 transition-[width] duration-300" style={{ width: `${progress}%` }}></div>
    </div>
  );
}


