import { ErrorBox } from "./components";


export const PaymentsError = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <ErrorBox>
            {errorMessage}
        </ErrorBox>
    )
}