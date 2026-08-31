import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "AFTERDARK", description: "Someone is waiting for you after dark." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
