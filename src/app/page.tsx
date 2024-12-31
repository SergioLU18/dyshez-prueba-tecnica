import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          src="/logo.svg"
          alt="Next.js logo"
          width={194}
          height={48}
          priority
        />
        <div className={styles.welcome}>!Bienvenido de vuelta!</div>
      </main>

    </div>
  );
}
