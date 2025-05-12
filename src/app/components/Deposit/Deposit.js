import style from './Deposit.module.css'


const Deposit = ({ onClose }) => {
    return (
        <div className={style.container}>
            <button onClick={onClose}>Close</button>
            <h1>Deposit</h1>
        </div>
    )
}

export default Deposit