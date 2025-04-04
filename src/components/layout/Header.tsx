"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./Header.module.scss";
import Link from "next/link";

export const Header = () => {
  return (
    <header className={styles.wrap}>
      <h1>JOHYUKRAE</h1>
      <div className={styles.menu}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
      </div>
      <ThemeToggle />
    </header>
  );
};
