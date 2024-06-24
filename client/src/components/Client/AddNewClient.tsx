import styles from './AddNewClient.module.css'


export function AddNewClient() {
  return (
    <div>
      <button className={styles.addNewClientButton}>
        Dodaj nowego klienta
      </button>
    </div>
  )
}
