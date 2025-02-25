"use client";
import Link from "next/link";
import styles from "../App.module.scss";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/Dashboard");
  // return (
  //   <div className={styles.container}>
  //     <h1>Welcome to BMetrics</h1>
  //     <nav>
  //       <ul>
  //         <li><Link href="/Login">Login</Link></li>
  //         <li><Link href="/Logout">Logout</Link></li>
  //         <li><Link href="/AboutUs">About Us</Link></li>
  //         <li><Link href="/ContactUs">Contact Us</Link></li>
  //         <li><Link href="/TargetBehavior">Target Behavior</Link></li>
  //       </ul>
  //     </nav>
  //   </div>
  // );
}