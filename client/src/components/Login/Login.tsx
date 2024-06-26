import styles from './Login.module.css'
import { useState } from 'react'

export const Login: React.FC = () => {
	const [isRegister, setIsRegister] = useState<boolean>(false)
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const [emailError, setEmailError] = useState<string>('')
	const [passwordError, setPasswordError] = useState<string>('')

	const validateEmail = (email: string): boolean => {
		const regExp =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return regExp.test(String(email).toLowerCase())
	}

	const validatePassword = (password: string): boolean => {
		return password.length >= 8
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		let isValid = true

		if (!validateEmail(email)) {
			setEmailError('Zły adres email')
			isValid = false
		} else {
			setEmailError('')
		}

		if (!validatePassword(password)) {
			setPasswordError('Hasło musi mieć 8 znaków ')
			isValid = false
		} else {
			setPasswordError('')
		}

		if (isValid) {
			console.log('Wysłano', { email, password, register: isRegister })
		}
	}

	const handleChangePanel = (): void => {
		setIsRegister(prev => !prev)
		setPassword('')
		setEmail('')
		setEmailError('')
		setPasswordError('')
	}
	return (
		<section className={styles.loginContainer}>
			<div className={styles.login}>
				<h1>{isRegister ? 'Zarejestruj sie' : 'Zaloguj się'}</h1>
				<form onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
					{emailError && <p className={styles.error}>{emailError}</p>}

					<label htmlFor="password">Hasło</label>
					<input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
					{passwordError && <p className={styles.error}>{passwordError}</p>}
					<section className={styles.buttonForm}>
						<button type="submit">{isRegister ? 'Zarejestruj' : 'Zaloguj'}</button>
						<span onClick={handleChangePanel}>{isRegister ? 'Zaloguj' : 'Rejestracja'}</span>
					</section>
				</form>
			</div>
		</section>
	)
}
