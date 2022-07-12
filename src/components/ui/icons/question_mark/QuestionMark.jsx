import styles from "./QuestionMark.module.scss"
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

const QuestionMark = ({size='medium'}) => {
    return (
      <span className={styles.question} >
        <QuestionMarkIcon fontSize={size} />
      </span>
          )
}

export default QuestionMark
