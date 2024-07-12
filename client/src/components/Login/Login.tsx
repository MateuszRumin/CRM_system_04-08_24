import styles from './Login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom' // Import useNavigate
export const Login: React.FC = () => {
	const [isRegister, setIsRegister] = useState<boolean>(false)
	const [submitErrors, setSubmitErrors] = useState<string>('')

	const navigate = useNavigate() // Initialize useNavigate
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		reset,
	} = useForm({ mode: 'onBlur' })

	const onSubmit = async (data: Object): Promise<void> => {
		// console.log(data)
		setSubmitErrors('')
		try {
			const response = await fetch('http://localhost:3000/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error('1')
			}
			const result = await response.json()

			const token = result.token
			// console.log(token)
			localStorage.setItem('token', token) // Save the token in localStorage

			alert('Login successful!')
			reset()
			navigate('/') // Redirect to the homepage
		} catch (error: any) {
			if (error.message == '1') setSubmitErrors(() => 'Nieprawidłowy login lub hasło')
			else setSubmitErrors('Wystąpił błąd połączenia')
		}
	}

	return (
		<section className={styles.loginContainer}>
			<div className={styles.login}>
				<h1>{isRegister ? 'Zarejestruj sie' : 'Zaloguj się'}</h1>

				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<label htmlFor="username">Nazwa użytkownika</label>
					<input
						type="text"
						id="username"
						{...register('username', {
							required: { value: true, message: 'Podaj username' },
						})}
					/>
					{errors.email && <span className={styles.error}>{`${errors.email.message}`}</span>}

					<label htmlFor="password">Hasło</label>
					<input type="password" id="password" {...register('password', { required: 'Podaj hasło' })} />
					{errors.password && <span className={styles.error}>{`${errors.password.message}`}</span>}
					{submitErrors && <span className={styles.error}>{submitErrors}</span>}

					<section className={styles.buttonForm}>
						<button type="submit">{isRegister ? 'Zarejestruj' : 'Zaloguj'}</button>
						<span
							onClick={() => {
								clearErrors()
								setIsRegister(prev => !prev)
							}}>
							{isRegister ? 'Zaloguj' : 'Rejestracja'}
						</span>
					</section>
				</form>
			</div>
		</section>
	)
}
