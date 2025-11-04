"use client";
import { useState, useEffect } from "react";
import styles from "./login.module.css";
import Beams from "./animation.js"
import Link from "next/link";
import { ArrowBigLeftDash, EyeOff, Eye } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.body.classList.add("login");
        return () => document.body.classList.remove("login");
    }, []);

    return (
        <div className={styles.container}>
            {/* Lado esquerdo */}

            <div className={styles.left}>
                <Link href={"../"}><button className={styles.backButton}><ArrowBigLeftDash size={16} strokeWidth={2} />   Voltar</button></Link>
                <Beams />
            </div>

            {/* Lado direito */}
            <div className={styles.right}>
                <div className={styles.formContainer}>
                    <h1 className={styles.welcome}>Welcome back</h1>
                    <p className={styles.description}>
                        Sign in to your account to continue your journey with Databuddy
                    </p>

                    <div className={styles.socials}>
                        <button className={styles.socialButton}>Sign in with Google</button>
                    </div>

                    <div className={styles.divider}>
                        <span>or continue with</span>
                    </div>

                    <form className={styles.form}>
                        <label>Email *</label>
                        <input type="email" placeholder="Enter your email" />

                        <div className={styles.passwordField}>
                            <label>Password *</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.eyeButton}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <a href="#" className={styles.forgotPassword}>
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className={styles.signInButton}>
                            Sign in
                        </button>

                        <button type="button" className={styles.magicLink}>
                            Sign in with magic link
                        </button>

                        <p className={styles.signupText}>
                            Don’t have an account? <a href="#">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
