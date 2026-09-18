interface IssueCountProps {
    count: number
}

const HIGH_ISSUE_THRESHOLD = 5

const getModifier = (count: number) => {
    if (count === 0) return 'issues--clear'

    return count >= HIGH_ISSUE_THRESHOLD ? 'issues--high' : 'issues--open'
}

export const IssueCount = ({ count }: IssueCountProps) => (
    <span className={`issues ${getModifier(count)}`}>
        {count}
        <span className="visually-hidden"> open issues</span>
    </span>
)
