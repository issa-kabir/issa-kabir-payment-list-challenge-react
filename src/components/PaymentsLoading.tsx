import { Spinner } from "./components";

export const PaymentsLoading = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner />
        </div>
    );
};