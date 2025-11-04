"use client";
import { useState, useEffect } from "react";
import styles from "./cadastro.module.css";
import Beams from "../login/animation.js"
import Link from "next/link";
import { ArrowBigLeftDash, EyeOff, Eye } from "lucide-react";

export default function CadastroPage() {
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
                    <h1 className={styles.welcome}>Cadastrar-se</h1>
                    <p className={styles.description}>
                        Crie e economize, inicie sua jornada na FinA
                    </p>

                    {/* <div className={styles.socials}>
                        <button className={styles.socialButton}>Sign in with Google</button>
                        <button className={styles.socialButton}>Sign in with Google</button>
                        <button className={styles.socialButton}>Sign in with Google</button>
                    </div>

                    <div className={styles.divider}>
                        <span>or continue with</span>
                    </div> */}

                    <form className={styles.form}>
                        <label>Email *</label>
                        <input type="email" placeholder="Cadastre seu email" />

                        <div className={styles.passwordField}>
                            <label>Senha *</label>
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
                        </div>
                        <div className={styles.passwordField}>
                            <label>Confirme sua senha *</label>
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
                        </div>

                        <button type="submit" className={styles.signInButton}>
                            Criar conta
                        </button>

                        {/* <button type="button" className={styles.magicLink}>
                            Sign in with magic link
                        </button> */}

                        <p className={styles.signupText}>
                            Já tem uma conta? <Link href="../login">Entrar</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
